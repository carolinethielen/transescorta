import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
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
  Globe,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';

export default function ProfileDetail() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Extract user ID from URL
  const profileId = new URLSearchParams(window.location.search).get('id');
  
  const { data: profile, isLoading, error } = useQuery({
    queryKey: [`/api/users/${profileId}`],
    enabled: !!profileId,
    retry: 1,
  });

  // Prepare image gallery - use profileImages array or fallback to single profileImageUrl
  const profileImages = profile?.profileImages && Array.isArray(profile.profileImages) && profile.profileImages.length > 0 
    ? profile.profileImages 
    : profile?.profileImageUrl 
    ? [profile.profileImageUrl]
    : ['https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % profileImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + profileImages.length) % profileImages.length);
  };

  // Reset image index when profile changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [profileId]);

  const handleContactEscort = () => {
    if (!user) {
      toast({
        title: t?.loginRequired || "Anmeldung erforderlich",
        description: t?.loginToContact || "Du musst dich anmelden, um Escorts zu kontaktieren",
        variant: "destructive",
      });
      setTimeout(() => {
        navigate("/select-type");
      }, 1000);
      return;
    }
    navigate(`/chat?user=${profileId}`);
    toast({
      title: t?.openingChat || "Chat wird geöffnet",
      description: `${t?.startingConversation || "Du startest eine Unterhaltung mit"} ${profile?.firstName || 'diesem Escort'}`,
    });
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
          <h2 className="text-xl font-semibold mb-2">{t?.profileNotFound || "Profil nicht gefunden"}</h2>
          <Button onClick={handleBack}>{t?.backToOverview || "Zurück zur Übersicht"}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background sticky top-0 z-10">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {t?.back || "Zurück"}
        </Button>
        <h1 className="text-lg font-semibold">{t?.profile || "Profil"}</h1>
        <div className="w-16" /> {/* Spacer for centering */}
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Multi-Image Gallery */}
        <Card>
          <CardContent className="p-0">
            <div className="relative h-96 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={profileImages[currentImageIndex]}
                alt={`${profile.firstName} ${profile.lastName} - Bild ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400';
                }}
              />
              
              {/* Image Navigation */}
              {profileImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    {currentImageIndex + 1}/{profileImages.length}
                  </div>
                  
                  {/* Image Dots */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {profileImages.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}
              
              {/* Status Badges */}
              {profile.isPremium && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    {t?.premium || "Premium"}
                  </Badge>
                </div>
              )}
              {profile.isOnline && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-green-500 text-white flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    {t?.online || "Online"}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">{profile.firstName} {profile.lastName}</h2>
              <div className="flex items-center justify-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {profile.age} {t?.years || "Jahre"}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {profile.location}
                </div>
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

        {/* About Section */}
        {profile.bio && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Über mich</h3>
              <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
            </CardContent>
          </Card>
        )}

        {/* Services */}
        {profile.services && profile.services.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">{t?.services || "Services"}</h3>
              <div className="flex flex-wrap gap-2">
                {profile.services.map((service: string, index: number) => (
                  <Badge key={index} variant="secondary" className="bg-[#FF007F]/10 text-[#FF007F] border-[#FF007F]/20">
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Physical Details */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {profile.height && (
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{t?.height || "Größe"}:</span>
                  <span>{profile.height} cm</span>
                </div>
              )}
              {profile.weight && (
                <div className="flex items-center gap-2">
                  <Weight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{t?.weight || "Gewicht"}:</span>
                  <span>{profile.weight} kg</span>
                </div>
              )}
              {profile.bodyType && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{t?.bodyType || "Körpertyp"}:</span>
                  <span>{profile.bodyType}</span>
                </div>
              )}
              {profile.ethnicity && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Herkunft:</span>
                  <span>{profile.ethnicity}</span>
                </div>
              )}
              {profile.position && (
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Position:</span>
                  <span className="capitalize">{profile.position}</span>
                </div>
              )}
              {profile.hourlyRate && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Preis:</span>
                  <span className="font-semibold text-[#FF007F]">{profile.hourlyRate}€/h</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">{t?.interests || "Interessen"}</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}