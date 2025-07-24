import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type User } from '@shared/schema';
import { MapPin, MessageCircle, Crown, Heart, Star, ArrowLeft } from 'lucide-react';
import { PlaceholderImage } from '@/components/PlaceholderImage';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function ProfileDetailFixed() {
  const [location, navigate] = useLocation();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  
  // Get user ID from URL params (either /profile/:userId or /profile?id=userId)
  const { userId } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const profileId = userId || urlParams.get('id');
  
  console.log('ProfileDetailFixed - Current location:', location);
  console.log('ProfileDetailFixed - userId from params:', userId);
  console.log('ProfileDetailFixed - URL search params:', window.location.search);
  console.log('ProfileDetailFixed - profileId resolved:', profileId);

  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ['/api/users', profileId, 'public'],
    queryFn: () => fetch(`/api/users/${profileId}/public`).then(res => {
      if (!res.ok) throw new Error('Profile not found');
      return res.json();
    }),
    enabled: !!profileId,
  });

  const handleContactEscort = () => {
    if (!currentUser) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Du musst dich anmelden, um Escorts zu kontaktieren",
        variant: "destructive",
      });
      setTimeout(() => {
        navigate("/select-type");
      }, 1000);
      return;
    }
    navigate(`/chat?user=${profileId}`);
    toast({
      title: "Chat wird geöffnet",
      description: `Du startest eine Unterhaltung mit ${user?.firstName || 'diesem Escort'}`,
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF007F] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Profil nicht gefunden</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Profile ID: {profileId || 'Keine ID gefunden'}
          </p>
          <Button onClick={() => navigate('/')}>Zurück zur Startseite</Button>
        </div>
      </div>
    );
  }

  const displayName = user.firstName || 'Anonymer Nutzer';
  const userAge = user.age ? `, ${user.age}` : '';

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="overflow-hidden">
        {/* Profile Header */}
        <div className="relative">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-[#FF007F]/20 to-purple-500/20" />
          
          {/* Back Button - Top Left */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 left-4 rounded-full z-10"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück
          </Button>

          {/* Contact Button - Top Right (only for other profiles) */}
          {currentUser && user && user.id !== currentUser.id && (
            <Button
              className="absolute top-4 right-4 rounded-full bg-[#FF007F] hover:bg-[#FF007F]/90 z-10"
              size="sm"
              onClick={handleContactEscort}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Kontakt
            </Button>
          )}

          {/* Profile Picture */}
          <div className="absolute -bottom-12 left-4">
            {user.profileImageUrl ? (
              <img 
                src={user.profileImageUrl}
                alt="Profilbild"
                className="w-24 h-24 rounded-full border-4 border-background object-cover"
                onError={(e) => {
                  console.log('Profile image failed to load:', user.profileImageUrl);
                  e.currentTarget.style.display = 'none';
                  // Show placeholder instead
                  const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.style.display = 'block';
                }}
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-background">
                <PlaceholderImage size="lg" userType={user.userType || 'trans'} />
              </div>
            )}
            {/* Hidden placeholder as fallback */}
            {user.profileImageUrl && (
              <div className="w-24 h-24 rounded-full border-4 border-background" style={{ display: 'none' }}>
                <PlaceholderImage size="lg" userType={user.userType || 'trans'} />
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
                {user.isPremium && (
                  <Crown className="w-5 h-5 text-yellow-500" />
                )}
              </h1>
              {user.location && (
                <p className="text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {user.location}
                </p>
              )}
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Über mich</h3>
              <p className="text-muted-foreground">{user.bio}</p>
            </div>
          )}

          {/* Trans Escort Specific Info */}
          {user.userType === 'trans' && (
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
          {user.profileImages && user.profileImages.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Weitere Bilder</h3>
              <div className="grid grid-cols-3 gap-2">
                {user.profileImages.map((imageUrl: string, index: number) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`Zusatzbild ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      console.log('Gallery image failed to load:', imageUrl);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {user.interests && user.interests.length > 0 && (
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
        </CardContent>
      </Card>
    </div>
  );
}