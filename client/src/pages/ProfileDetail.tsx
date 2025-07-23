import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  MapPin, 
  Crown, 
  MessageCircle, 
  Heart,
  Clock,
  User,
  Ruler,
  Weight,
  Target,
  Globe
} from 'lucide-react';

export default function ProfileDetail() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Extract user ID from URL
  const profileId = new URLSearchParams(window.location.search).get('id');
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['/api/users', profileId],
    enabled: !!profileId,
  });

  const handleContactEscort = () => {
    if (!user) {
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
  };

  const handleBack = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF007F] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Profil nicht gefunden</h2>
          <Button onClick={handleBack}>Zurück zur Übersicht</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
            <h1 className="text-xl font-semibold">Profil Details</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Image and Basic Info */}
          <div className="lg:col-span-1">
            <Card>
              <div className="relative">
                <img
                  src={profile.profileImageUrl || 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=600'}
                  alt={profile.firstName}
                  className="w-full h-96 object-cover rounded-t-lg"
                />
                
                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {profile.isOnline && (
                    <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                      <div className="w-2 h-2 bg-white rounded-full" />
                      Online
                    </div>
                  )}
                  
                  {profile.isPremium && (
                    <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      Premium
                    </div>
                  )}
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {profile.firstName}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {profile.age} Jahre
                  </p>
                  
                  <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-6">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </div>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={handleContactEscort}
                      className="w-full bg-[#FF007F] hover:bg-[#FF007F]/90 text-white"
                      size="lg"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Jetzt kontaktieren
                    </Button>
                    
                    <Button variant="outline" className="w-full" size="lg">
                      <Heart className="w-4 h-4 mr-2" />
                      Zu Favoriten
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Me */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Über mich</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {profile.aboutMe || profile.bio}
                </p>
                
                {profile.whatILike && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Was ich mag:</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {profile.whatILike}
                    </p>
                  </div>
                )}
                
                {profile.whatIExpect && (
                  <div>
                    <h4 className="font-medium mb-2">Was ich erwarte:</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {profile.whatIExpect}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Services</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.services?.map((service: string, index: number) => (
                    <Badge key={index} variant="secondary" className="bg-[#FF007F]/10 text-[#FF007F] border-[#FF007F]/20">
                      {service}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Allgemein Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Allgemein</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Alter</span>
                    <span className="font-medium">{profile.age}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Größe</span>
                    <span className="font-medium">{profile.height || 'Nicht angegeben'}cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Gewicht</span>
                    <span className="font-medium">{profile.weight || 'Nicht angegeben'}kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Statur</span>
                    <span className="font-medium">{profile.bodyType || 'Schlank'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Typ</span>
                    <span className="font-medium">{profile.ethnicity || 'Europäisch'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Haarlänge</span>
                    <span className="font-medium">Lang</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Haarfarbe</span>
                    <span className="font-medium">Schwarz</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Bart</span>
                    <span className="font-medium">Kein Bart</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Augenfarbe</span>
                    <span className="font-medium">Braun</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Körperbehaarung</span>
                    <span className="font-medium">Unbehaart</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Ich bin</span>
                    <span className="font-medium text-red-500">Eine Trans Frau, andersw Ort ansässig</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Raucher</span>
                    <span className="font-medium">{profile.smoking ? 'Ja' : 'Nein'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tattoos</span>
                    <span className="font-medium">{profile.tattoos || 'Wenige'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Piercings</span>
                    <span className="font-medium">{profile.piercings || 'Wenige'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Sprachen</span>
                    <span className="font-medium">{profile.languages?.join(', ') || 'Deutsch, Englisch'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dienstleistungen Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Dienstleistungen</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Ich biete</span>
                    <span className="font-medium">{profile.services?.join(', ') || 'Escort, Massage'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Preis pro Stunde</span>
                    <span className="font-medium">{profile.rates?.['1h'] || profile.hourlyRate}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Preis pro Nacht</span>
                    <span className="font-medium">{profile.rates?.['overnight'] || '2000'}€</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Preise</h3>
                <div className="space-y-3">
                  {profile.rates ? (
                    <>
                      {profile.rates['1h'] && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">1 Stunde</span>
                          <span className="font-bold text-[#FF007F]">{profile.rates['1h']}€</span>
                        </div>
                      )}
                      {profile.rates['2h'] && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">2 Stunden</span>
                          <span className="font-bold text-[#FF007F]">{profile.rates['2h']}€</span>
                        </div>
                      )}
                      {profile.rates['overnight'] && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Übernachtung</span>
                          <span className="font-bold text-[#FF007F]">{profile.rates['overnight']}€</span>
                        </div>
                      )}
                      {profile.rates['weekend'] && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-700 dark:text-gray-300">Wochenende</span>
                          <span className="font-bold text-[#FF007F]">{profile.rates['weekend']}€</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700 dark:text-gray-300">Stundensatz</span>
                      <span className="font-bold text-[#FF007F]">
                        {profile.hourlyRate ? `${profile.hourlyRate}€` : 'Preis auf Anfrage'}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                  Alle Preise sind Richtwerte. Finale Preise werden individuell vereinbart.
                </p>
              </CardContent>
            </Card>

            {/* Interests */}
            {profile.interests && profile.interests.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Interessen</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}