import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProfileCard } from '@/components/ProfileCard';
import { SwipeCard } from '@/components/SwipeCard';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from '@/hooks/useLocation';
import { isUnauthorizedError } from '@/lib/authUtils';
import { apiRequest } from '@/lib/queryClient';
import { MapPin, Moon, Sun, Grid3X3, Heart, X, MessageCircle } from 'lucide-react';
import { type User } from '@shared/schema';

export default function Home() {
  const [viewMode, setViewMode] = useState<'grid' | 'swipe'>('grid');
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const { location } = useLocation();
  const queryClient = useQueryClient();

  // Fetch users based on authentication status
  const { data: rawUsers = [], isLoading, error } = useQuery({
    queryKey: user ? ['/api/users/recommended'] : ['/api/users/public'],
    retry: false,
  });

  // Convert database users to frontend-compatible users
  const users: User[] = (rawUsers as any[]).map((user: any) => ({
    ...user,
    firstName: user.firstName || undefined,
    lastName: user.lastName || undefined,
    profileImageUrl: user.profileImageUrl || undefined,
    location: user.location || undefined,
    interests: user.interests || [],
  }));

  // Handle unauthorized error only for authenticated routes
  useEffect(() => {
    if (error && isUnauthorizedError(error as Error) && user) {
      toast({
        title: "Unauthorized",
        description: "Du bist nicht mehr angemeldet. Leite weiter...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [error, toast, user]);

  // Create match mutation
  const createMatchMutation = useMutation({
    mutationFn: async ({ targetUserId, isLike }: { targetUserId: string; isLike: boolean }) => {
      await apiRequest('POST', '/api/matches', { targetUserId, isLike });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/recommended'] });
      queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "Du bist nicht mehr angemeldet. Leite weiter...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Fehler",
        description: "Konnte Match nicht erstellen",
        variant: "destructive",
      });
    },
  });

  const handleSwipe = (userId: string, direction: 'left' | 'right') => {
    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Du musst dich anmelden, um zu liken",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }
    
    const isLike = direction === 'right';
    createMatchMutation.mutate({ targetUserId: userId, isLike });
    
    if (currentSwipeIndex < users.length - 1) {
      setCurrentSwipeIndex(currentSwipeIndex + 1);
    } else {
      // No more users to swipe
      setCurrentSwipeIndex(0);
    }
  };

  const handleCardClick = (clickedUser: User) => {
    // Check if user is authenticated for messaging
    if (!user) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Du musst dich anmelden, um Profile zu kontaktieren",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }
    // Navigate to chat with this user
    window.location.href = `/chat?user=${clickedUser.id}`;
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF007F] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-background">
      {/* Mobile Header */}
      <header className="md:hidden flex justify-between items-center p-4 border-b border-border bg-background w-full">
        <h1 className="text-2xl font-bold text-[#FF007F] font-['Poppins']">TransEscorta</h1>
        <div className="flex items-center space-x-3">
          {/* Location Badge */}
          <div className="flex items-center bg-muted px-3 py-1 rounded-full text-sm">
            <MapPin className="w-4 h-4 text-[#FF007F] mr-1" />
            <span>{location?.city || user?.location || 'Berlin'}</span>
          </div>
          
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2 rounded-full"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:block mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF007F] to-purple-600 bg-clip-text text-transparent">
              Entdecke TS-Escorts
            </h1>
            {location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-6 h-6 text-[#FF007F]" />
                <span className="text-lg">{location?.city || user?.location || 'Berlin'}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'dark' ? (
                <Sun className="w-6 h-6" />
              ) : (
                <Moon className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 md:p-0 bg-background">
        {/* View Toggle */}
        <div className="flex mb-6 bg-muted rounded-lg p-1 max-w-xs md:max-w-sm">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="flex-1 rounded-md"
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            Raster
          </Button>
          <Button
            variant={viewMode === 'swipe' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('swipe')}
            className="flex-1 rounded-md md:hidden"
          >
            <Heart className="w-4 h-4 mr-2" />
            Swipe
          </Button>
        </div>

        {users.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Keine neuen Profile verfügbar.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/users/recommended'] })}
            >
              Aktualisieren
            </Button>
          </Card>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {users.map((user: any) => (
                  <ProfileCard
                    key={user.id}
                    user={user}
                    onClick={handleCardClick}
                  />
                ))}
              </div>
            )}

            {/* Swipe View - Mobile Only */}
            {viewMode === 'swipe' && (
              <div className="md:hidden">
                <div className="relative h-96 mx-auto max-w-sm mb-8">
                  {users[currentSwipeIndex] && (
                    <SwipeCard
                      key={users[currentSwipeIndex].id}
                      user={users[currentSwipeIndex]}
                      onSwipe={handleSwipe}
                    />
                  )}
                </div>

                {/* Swipe Actions */}
                <div className="flex justify-center space-x-8">
                  <Button
                    size="lg"
                    variant="destructive"
                    className="w-16 h-16 rounded-full"
                    onClick={() => users[currentSwipeIndex] && handleSwipe(users[currentSwipeIndex].id, 'left')}
                  >
                    <X className="w-8 h-8" />
                  </Button>
                  <Button
                    size="lg"
                    className="w-20 h-20 rounded-full bg-[#FF007F] hover:bg-[#FF007F]/90"
                    onClick={() => users[currentSwipeIndex] && handleSwipe(users[currentSwipeIndex].id, 'right')}
                  >
                    <Heart className="w-10 h-10" />
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-16 h-16 rounded-full"
                    onClick={() => handleCardClick(users[currentSwipeIndex])}
                  >
                    <MessageCircle className="w-8 h-8" />
                  </Button>
                </div>
              </div>
            )}

            {/* Desktop: Always show grid, force grid view */}
            <div className="hidden md:block">
              <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {users.map((user: any) => (
                  <ProfileCard
                    key={user.id}
                    user={user}
                    onClick={handleCardClick}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
