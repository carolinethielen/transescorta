import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LocationSelector } from '@/components/LocationSelector';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useGeolocation } from '@/hooks/useGeolocation';
import { MapPin, Moon, Sun, MessageCircle, Crown, Star, Heart, Filter } from 'lucide-react';
import { type User } from '@shared/schema';

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState('Mein Standort');
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const { coordinates, isLoading: locationLoading } = useGeolocation();
  const queryClient = useQueryClient();

  // Auto-set user coordinates when GPS location is available
  useEffect(() => {
    if (coordinates && !userCoordinates) {
      setUserCoordinates({ lat: coordinates.latitude, lon: coordinates.longitude });
    }
  }, [coordinates, userCoordinates]);

  // Fetch escorts based on authentication status
  const { data: rawUsers = [], isLoading, error } = useQuery({
    queryKey: user ? ['/api/users/recommended'] : ['/api/users/public'],
    retry: false,
  });

  // Convert and organize escorts by categories
  const escorts = (rawUsers as any[]).map((escort: any) => {
    const distance = escort.latitude && escort.longitude && userCoordinates
      ? calculateDistance(userCoordinates.lat, userCoordinates.lon, escort.latitude, escort.longitude)
      : 0;
    
    return {
      ...escort,
      firstName: escort.firstName || '',
      lastName: escort.lastName || '',
      profileImageUrl: escort.profileImageUrl || '',
      location: escort.location || '',
      services: escort.services || [],
      distance,
    };
  });

  // Organize escorts like hunqz.com: Premium first, then new, then by distance
  const premiumEscorts = escorts.filter(escort => escort.isPremium);
  const newEscorts = escorts.filter(escort => !escort.isPremium).sort((a, b) => 
    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );
  const nearbyEscorts = [...escorts].sort((a, b) => a.distance - b.distance);

  const handleContactEscort = (escort: any) => {
    if (!user) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Du musst dich anmelden, um Escorts zu kontaktieren",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/select-type";
      }, 1000);
      return;
    }
    window.location.href = `/chat?user=${escort.id}`;
  };

  // Handle location change
  const handleLocationChange = (location: string, coordinates?: { lat: number; lon: number }) => {
    setSelectedLocation(location);
    if (coordinates) {
      setUserCoordinates(coordinates);
    }
  };

  const EscortCard = ({ escort }: { escort: any }) => (
    <Card 
      className="overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
      onClick={() => window.location.href = `/profile?id=${escort.id}`}
    >
      <div className="relative">
        <img
          src={escort.profileImageUrl || 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400'}
          alt={escort.firstName || 'Escort Profile'}
          className="w-full h-56 object-cover"
        />
        
        {/* Online Status */}
        {escort.isOnline && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            <div className="w-2 h-2 bg-white rounded-full" />
            Online
          </div>
        )}
        
        {/* Premium Badge */}
        {escort.isPremium && (
          <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Crown className="w-3 h-3" />
            Premium
          </div>
        )}
        
        {/* Distance */}
        {escort.distance > 0 && (
          <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {Math.round(escort.distance)}km
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        {/* Name and Age */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
            {escort.firstName}
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
            {escort.age}
          </span>
        </div>
        
        {/* Location */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {escort.location}
        </p>
        
        {/* Services */}
        <div className="flex flex-wrap gap-1 mb-3">
          {escort.services?.slice(0, 2).map((service: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {service}
            </Badge>
          ))}
          {escort.services?.length > 2 && (
            <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              +{escort.services.length - 2}
            </Badge>
          )}
        </div>
        
        {/* Price and Contact */}
        <div className="flex justify-between items-center">
          <span className="font-bold text-[#FF007F] text-lg">
            {escort.hourlyRate ? `${escort.hourlyRate}€` : 'n.V.'}
          </span>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleContactEscort(escort);
            }}
            className="bg-[#FF007F] hover:bg-[#FF007F]/90 text-white px-4"
          >
            Kontakt
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const SectionHeader = ({ title, icon: Icon, count }: { title: string; icon: any; count: number }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-[#FF007F]" />
        <h2 className="text-xl font-semibold">{title}</h2>
        <Badge variant="secondary">{count}</Badge>
      </div>
    </div>
  );

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
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#FF007F]">TransConnect</h1>
            
            <div className="flex items-center space-x-3">
              {/* Location Selector */}
              <LocationSelector
                selectedLocation={selectedLocation}
                onLocationChange={handleLocationChange}
              />
              
              {/* Filter Button */}
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-6">
          {locationLoading && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Standort wird ermittelt...</p>
            </div>
          )}
          
          {/* Premium Escorts Section */}
          {premiumEscorts.length > 0 && (
            <section className="mb-8">
              <SectionHeader title="Premium Escorts" icon={Crown} count={premiumEscorts.length} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {premiumEscorts.map((escort) => (
                  <EscortCard key={escort.id} escort={escort} />
                ))}
              </div>
            </section>
          )}

          {/* New Escorts Section */}
          {newEscorts.length > 0 && (
            <section className="mb-8">
              <SectionHeader title="Neue Escorts" icon={Star} count={newEscorts.slice(0, 10).length} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {newEscorts.slice(0, 10).map((escort) => (
                  <EscortCard key={escort.id} escort={escort} />
                ))}
              </div>
            </section>
          )}

          {/* Nearby Escorts Section */}
          {nearbyEscorts.length > 0 && (
            <section className="mb-8">
              <SectionHeader 
                title={selectedLocation === 'Mein Standort' ? 'Escorts in der Nähe' : `Escorts in ${selectedLocation}`} 
                icon={MapPin} 
                count={nearbyEscorts.length} 
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {nearbyEscorts.map((escort) => (
                  <EscortCard key={escort.id} escort={escort} />
                ))}
              </div>
            </section>
          )}

          {escorts.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Keine Escorts in dieser Region verfügbar.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}