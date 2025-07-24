import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { type User, type Match } from '@shared/schema';
import { MapPin, Edit, Crown, Heart, MessageCircle, Star, Settings } from 'lucide-react';
import { PlaceholderImage } from '@/components/PlaceholderImage';
import { useLocation } from 'wouter';

export default function Profile() {
  const { user, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  // Fetch user matches for stats
  const { data: matches = [] } = useQuery<(Match & { user: User })[]>({
    queryKey: ['/api/matches'],
    retry: false,
  });

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
          
          {/* Single Edit Button - Top Right */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4 rounded-full"
            onClick={() => navigate('/profile/edit')}
          >
            <Edit className="w-4 h-4 mr-2" />
            Bearbeiten
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
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {displayName}{userAge}
                {user?.isPremium && (
                  <Crown className="w-5 h-5 text-yellow-500" />
                )}
              </h1>
              {user?.location && (
                <p className="text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {user.location}
                </p>
              )}
            </div>
          </div>

          {/* Bio */}
          {user?.bio && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Über mich</h3>
              <p className="text-muted-foreground">{user.bio}</p>
            </div>
          )}

          {/* Trans Escort Specific Info */}
          {user?.userType === 'trans' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Physical Details */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#FF007F]" />
                    Körperliche Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    {user.height && (
                      <div>Größe: {user.height} cm</div>
                    )}
                    {user.weight && (
                      <div>Gewicht: {user.weight} kg</div>
                    )}
                    {user.bodyType && (
                      <div>Körpertyp: {user.bodyType}</div>
                    )}
                    {user.ethnicity && (
                      <div>Ethnizität: {user.ethnicity}</div>
                    )}
                    {user.cockSize && (
                      <div>Schwanzgröße: {user.cockSize} cm</div>
                    )}
                    {user.circumcision && (
                      <div>Beschneidung: {user.circumcision}</div>
                    )}
                    {user.position && (
                      <div>Position: {user.position}</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Services & Pricing */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#FF007F]" />
                    Services & Preise
                  </h4>
                  <div className="space-y-2 text-sm">
                    {user.hourlyRate && (
                      <div className="font-medium text-[#FF007F] text-lg">
                        {user.hourlyRate}€ / Stunde
                      </div>
                    )}
                    {user.services && user.services.length > 0 && (
                      <div>
                        <div className="text-xs text-muted-foreground mb-2">Services:</div>
                        <div className="flex flex-wrap gap-1">
                          {user.services.map((service: string, idx: number) => (
                            <Badge key={`${service}-${idx}`} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Additional Images Gallery */}
          {user?.profileImages && user.profileImages.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Weitere Bilder</h3>
              <div className="grid grid-cols-3 gap-2">
                {user.profileImages.map((imageUrl: string, index: number) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`Zusatzbild ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {user?.interests && user.interests.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Interessen</h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}



          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button 
              onClick={() => navigate('/profile/edit')} 
              className="flex-1 bg-[#FF007F] hover:bg-[#E6006B]"
            >
              <Edit className="w-4 h-4 mr-2" />
              Profil bearbeiten
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/settings')}
              className="flex-1"
            >
              <Settings className="w-4 h-4 mr-2" />
              Einstellungen
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}