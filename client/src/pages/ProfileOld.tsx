import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import { apiRequest } from '@/lib/queryClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, type User, type Match } from '@shared/schema';
import { MapPin, Edit, Crown, Heart, MessageCircle, Star } from 'lucide-react';
import { PlaceholderImage } from '@/components/PlaceholderImage';
import { useLocation } from 'wouter';

export default function Profile() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  // Fetch user matches for stats
  const { data: matches = [] } = useQuery<(Match & { user: User })[]>({
    queryKey: ['/api/matches'],
    retry: false,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest('PUT', '/api/profile', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: "Erfolg",
        description: "Profil wurde aktualisiert",
      });
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
        description: "Profil konnte nicht aktualisiert werden",
        variant: "destructive",
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      age: user?.age || 18,
      bio: user?.bio || '',
      location: user?.location || '',
      interests: user?.interests || [],
    },
  });

  const onSubmit = (data: any) => {
    updateProfileMutation.mutate(data);
  };

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF007F] border-t-transparent rounded-full" />
      </div>
    );
  }

  const displayName = user?.firstName || 'Anonymer Nutzer';
  const userAge = user?.age ? `, ${user.age}` : '';
  const mutualMatches = matches.filter((match: any) => match.isMutual);

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="overflow-hidden">
        {/* Profile Header */}
        <div className="relative">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-[#FF007F]/20 to-purple-500/20" />
          
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4 rounded-full"
            onClick={() => navigate('/my-profile/edit')}
          >
            <Edit className="w-4 h-4" />
          </Button>

          {/* Profile Picture */}
          <div className="absolute -bottom-12 left-4">
            {user?.profileImageUrl ? (
              <img 
                src={user.profileImageUrl}
                alt="Profilbild"
                className="w-24 h-24 rounded-full border-4 border-background object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-background">
                <PlaceholderImage size="lg" userType={user?.userType || 'trans'} />
              </div>
            )}
          </div>
        </div>

        <CardContent className="pt-16 pb-6 px-6">
          {/* Profile Info */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">{displayName}{userAge}</h2>
              <p className="text-muted-foreground">
                <MapPin className="w-4 h-4 inline mr-1" />
                {user?.location || 'Standort nicht angegeben'}
              </p>
            </div>
            {user?.isPremium && (
              <Badge className="bg-[#FF007F]/20 text-[#FF007F] hover:bg-[#FF007F]/30">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#FF007F]">{matches.length}</div>
              <div className="text-xs text-muted-foreground">Matches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#FF007F]">{mutualMatches.length}</div>
              <div className="text-xs text-muted-foreground">Chats</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#FF007F]">4.8</div>
              <div className="text-xs text-muted-foreground">Bewertung</div>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Über mich</h3>
            <p className="text-sm text-muted-foreground">
              {user?.bio || 'Noch keine Beschreibung hinzugefügt.'}
            </p>
          </div>

          {/* Interests */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Interessen</h3>
            <div className="flex flex-wrap gap-2">
              {user?.interests && user.interests.length > 0 ? (
                user.interests.map((interest: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {interest}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Keine Interessen angegeben.</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button 
              className="flex-1 bg-[#FF007F] hover:bg-[#FF007F]/90"
              onClick={() => {
                // Navigate to edit profile
                console.log('Edit profile');
              }}
            >
              Profil bearbeiten
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Edit Form (could be in a modal) */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Profil bearbeiten</h3>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Vorname</label>
                <Input
                  {...form.register('firstName')}
                  placeholder="Vorname"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Nachname</label>
                <Input
                  {...form.register('lastName')}
                  placeholder="Nachname"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Alter</label>
              <Input
                type="number"
                {...form.register('age', { valueAsNumber: true })}
                min={18}
                max={100}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Standort</label>
              <Input
                {...form.register('location')}
                placeholder="Berlin, Deutschland"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Über mich</label>
              <Textarea
                {...form.register('bio')}
                placeholder="Erzähle etwas über dich..."
                maxLength={500}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#FF007F] hover:bg-[#FF007F]/90"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? 'Speichern...' : 'Profil speichern'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
