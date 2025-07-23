import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProfileCard } from '@/components/ProfileCard';
import { SwipeCard } from '@/components/SwipeCard';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
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
  const queryClient = useQueryClient();

  // Fetch recommended users
  const { data: rawUsers = [], isLoading, error } = useQuery({
    queryKey: ['/api/users/recommended'],
    retry: false,
  });

  // Convert database users to frontend-compatible users
  const users: User[] = rawUsers.map((user: any) => ({
    ...user,
    firstName: user.firstName || undefined,
    lastName: user.lastName || undefined,
    profileImageUrl: user.profileImageUrl || undefined,
    location: user.location || undefined,
    interests: user.interests || [],
  }));

  // Handle unauthorized error
  useEffect(() => {
    if (error && isUnauthorizedError(error as Error)) {
      toast({
        title: "Unauthorized",
        description: "Du bist nicht mehr angemeldet. Leite weiter...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [error, toast]);

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
    // Navigate to user profile or show details
    console.log('Clicked user:', clickedUser);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF007F] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-border">
        <h1 className="text-2xl font-bold text-[#FF007F] font-['Poppins']">TransConnect</h1>
        <div className="flex items-center space-x-3">
          {/* Location Badge */}
          <div className="flex items-center bg-muted px-3 py-1 rounded-full text-sm">
            <MapPin className="w-4 h-4 text-[#FF007F] mr-1" />
            <span>{user?.location || 'Berlin'}</span>
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

      {/* Content */}
      <main className="p-4">
        {/* View Toggle */}
        <div className="flex mb-4 bg-muted rounded-lg p-1">
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
            className="flex-1 rounded-md"
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
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {users.map((user: any) => (
                  <ProfileCard
                    key={user.id}
                    user={user}
                    onClick={handleCardClick}
                  />
                ))}
              </div>
            )}

            {/* Swipe View */}
            {viewMode === 'swipe' && (
              <div>
                <div className="relative h-96 mx-auto max-w-sm mb-8">
                  {users[currentSwipeIndex] && (
                    <SwipeCard
                      key={users[currentSwipeIndex].id}
                      user={users[currentSwipeIndex] as User}
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
          </>
        )}
      </main>
    </div>
  );
}
