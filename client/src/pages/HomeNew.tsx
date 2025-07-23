import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
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
  const [location, navigate] = useLocation();

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

  // Also fetch public escorts to always show demo data
  const { data: publicUsers = [] } = useQuery({
    queryKey: ['/api/users/public'],
    retry: false,
  });

  // Use public escorts if recommended is empty or failed
  const displayUsers = (rawUsers && Array.isArray(rawUsers) && rawUsers.length > 0) ? rawUsers : publicUsers;

  // Convert and organize escorts by categories
  const escorts = (displayUsers as any[]).map((escort: any) => {
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

  const handleEscortClick = (escortId: string) => {
    if (!user) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Du musst dich anmelden, um Profile anzusehen",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/select-type";
      }, 1000);
      return;
    }
    // Use wouter navigation for instant loading without page reload
    navigate(`/profile?id=${escortId}`);
  };

  const EscortCard = ({ escort }: { escort: any }) => (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 hover:scale-[1.02]"
      onClick={() => handleEscortClick(escort.id)}
    >
      <div className="relative aspect-[3/4]">
        <img
          src={escort.profileImageUrl || 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=600'}
          alt={escort.firstName || 'Escort Profile'}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=600';
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {escort.isOnline && (
            <div className="flex items-center gap-1 bg-green-500/90 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-full text-xs font-medium shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Online
            </div>
          )}
          
          {escort.isPremium && (
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
              <Crown className="w-3 h-3" />
              Premium
            </div>
          )}
        </div>
        
        {/* Price Badge */}
        {escort.hourlyRate && (
          <div className="absolute top-3 right-3 bg-[#FF007F]/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
            {escort.hourlyRate}€/h
          </div>
        )}
        
        {/* Bottom Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg truncate">
              {escort.firstName}
            </h3>
            <span className="text-sm bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
              {escort.age}J
            </span>
          </div>
          
          <div className="flex items-center text-sm opacity-90">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            {escort.location}
          </div>
          
          {/* Services Preview */}
          {escort.services && escort.services.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <div className="flex gap-1">
                {escort.services.slice(0, 2).map((service: string, index: number) => (
                  <span key={index} className="text-xs bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    {service}
                  </span>
                ))}
                {escort.services.length > 2 && (
                  <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    +{escort.services.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Distance - if available */}
        {escort.distance > 0 && (
          <div className="absolute bottom-16 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
            {Math.round(escort.distance)}km
          </div>
        )}
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
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