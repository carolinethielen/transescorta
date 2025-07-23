import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Globe,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';
import type { User as UserType } from '@shared/schema';

export default function ProfileDetailFixed() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Extract user ID from URL
  const profileId = new URLSearchParams(window.location.search).get('id');
  
  const { data: profile, isLoading, error } = useQuery<UserType>({
    queryKey: [`/api/users/${profileId}`],
    enabled: !!profileId,
    retry: 1,
  });

  // Prepare image gallery
  const profileImages = profile?.profileImageUrl 
    ? [profile.profileImageUrl]
    : ['https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % profileImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + profileImages.length) % profileImages.length);
  };

  const handleContactEscort = () => {
    if (!user) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Du musst dich anmelden, um Escorts zu kontaktieren",
        variant: "destructive",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }
    
    navigate(`/chat?user=${profileId}`);
    toast({
      title: "Chat wird geöffnet",
      description: `Du startest eine Unterhaltung mit ${profile?.firstName || 'diesem Escort'}`,
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
          <h2 className="text-xl font-semibold mb-2">Profil nicht gefunden</h2>
          <Button onClick={handleBack}>Zurück zur Übersicht</Button>
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
          Zurück
        </Button>
        <h1 className="text-lg font-semibold">Profil</h1>
        <div className="w-16" />
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Profile Image */}
        <Card>
          <CardContent className="p-0">
            <div className="relative h-96 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={profileImages[currentImageIndex]}
                alt={`${profile.firstName || 'Escort'} - Profilbild`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400';
                }}
              />
              
              {/* Status Badges */}
              {profile.isPremium && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Premium
                  </Badge>
                </div>
              )}
              {profile.isOnline && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-green-500 text-white flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Online
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
              <h2 className="text-2xl font-bold mb-2">
                {profile.firstName} {profile.lastName || ''}
              </h2>
              
              <div className="flex items-center justify-center gap-4 text-muted-foreground mb-4">
                {profile.age && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {profile.age} Jahre
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </div>
                )}
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

        {/* Bio Section */}
        {profile.bio && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3">Über mich</h3>
              <p className="text-muted-foreground leading-relaxed">
                {profile.bio}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Services */}
        {profile.services && profile.services.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3">Services</h3>
              <div className="flex flex-wrap gap-2">
                {profile.services.map((service, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Details */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Details</h3>
            <div className="grid grid-cols-2 gap-4">
              {profile.height && (
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Größe</p>
                    <p className="font-medium">{profile.height} cm</p>
                  </div>
                </div>
              )}
              
              {profile.weight && (
                <div className="flex items-center gap-2">
                  <Weight className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Gewicht</p>
                    <p className="font-medium">{profile.weight} kg</p>
                  </div>
                </div>
              )}
              
              {profile.bodyType && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Körpertyp</p>
                    <p className="font-medium">{profile.bodyType}</p>
                  </div>
                </div>
              )}
              
              {profile.ethnicity && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Herkunft</p>
                    <p className="font-medium">{profile.ethnicity}</p>
                  </div>
                </div>
              )}
              
              {profile.position && (
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Position</p>
                    <p className="font-medium capitalize">{profile.position}</p>
                  </div>
                </div>
              )}
              
              {profile.hourlyRate && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Stundensatz</p>
                    <p className="font-medium">{profile.hourlyRate}€</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3">Interessen</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
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