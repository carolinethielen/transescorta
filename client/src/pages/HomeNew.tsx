import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LocationSelector } from '@/components/LocationSelector';
import { FilterDialog } from '@/components/FilterDialog';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useGeolocation } from '@/hooks/useGeolocation';
import { MapPin, Moon, Sun, MessageCircle, Crown, Star } from 'lucide-react';
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
  const [filters, setFilters] = useState<any>(null);
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

  // Apply filters if any
  const filteredEscorts = filters ? escorts.filter(escort => {
    if (filters.ageRange && (escort.age < filters.ageRange[0] || escort.age > filters.ageRange[1])) return false;
    if (filters.priceRange && escort.hourlyRate && (escort.hourlyRate < filters.priceRange[0] || escort.hourlyRate > filters.priceRange[1])) return false;
    if (filters.position && escort.position !== filters.position) return false;
    if (filters.bodyType && escort.bodyType !== filters.bodyType) return false;
    if (filters.ethnicity && escort.ethnicity !== filters.ethnicity) return false;
    if (filters.onlineOnly && !escort.isOnline) return false;
    if (filters.premiumOnly && !escort.isPremium) return false;
    if (filters.services && filters.services.length > 0) {
      const hasService = filters.services.some((service: string) => escort.services?.includes(service));
      if (!hasService) return false;
    }
    return true;
  }) : escorts;

  // Organize escorts like hunqz.com: Premium first, then new, then by distance
  const premiumEscorts = filteredEscorts.filter(escort => escort.isPremium);
  const newEscorts = filteredEscorts.filter(escort => !escort.isPremium).sort((a, b) => 
    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );
  const nearbyEscorts = [...filteredEscorts].sort((a, b) => a.distance - b.distance);

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
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
      onClick={() => window.location.href = `/profile?id=${escort.id}`}
    >
      <div className="relative">
        <img
          src={escort.profileImageUrl || 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400'}
          alt={escort.firstName || 'Escort Profile'}
          className="w-full aspect-[4/5] object-cover"
        />
        
        {/* Status Indicators */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {escort.isOnline && (
            <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
              Online
            </div>
          )}
          {escort.isPremium && (
            <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
              <Crown className="w-3 h-3" />
              VIP
            </div>
          )}
        </div>

        {/* Distance */}
        {escort.distance > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
            {Math.round(escort.distance)}km
          </div>
        )}
      </div>
      
      {/* Card Content - Minimal like hunqz.com */}
      <div className="p-3">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-semibold text-base text-gray-900 dark:text-white truncate">
            {escort.firstName}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {escort.age}
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
          <MapPin className="w-3 h-3 mr-1" />
          {escort.location}
        </div>

        <div className="text-right">
          <span className="font-semibold text-[#FF007F]">
            {escort.hourlyRate ? `ab ${escort.hourlyRate}€` : 'Preis n.V.'}
          </span>
        </div>
      </div>
    </div>
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
              <FilterDialog onFiltersChange={setFilters} />
              
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
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