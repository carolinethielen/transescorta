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
import AuthModalNew from '@/components/AuthModalNew';

import { PlaceholderImage } from '@/components/PlaceholderImage';
import { useToast } from '@/hooks/use-toast';
import { useGeolocation } from '@/hooks/useGeolocation';
import { MapPin, Moon, Sun, MessageCircle, Crown, Star } from 'lucide-react';
import { type User } from '@shared/schema';
import { calculateDistance as calcDist, formatDistance } from '@/utils/location';

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
  const { user, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const { toast } = useToast();
  const { coordinates, currentCity, isLoading: locationLoading } = useGeolocation();
  const queryClient = useQueryClient();
  const [location, navigate] = useLocation();

  // Auto-set user coordinates and location when GPS location is available
  useEffect(() => {
    if (coordinates && currentCity) {
      setUserCoordinates({ lat: coordinates.latitude, lon: coordinates.longitude });
      
      // Always update location to show detected city when GPS is used
      if (selectedLocation === 'Mein Standort' || selectedLocation === 'Aktuellen Standort verwenden' || selectedLocation === 'Standort wird ermittelt...') {
        setSelectedLocation(currentCity);
      }
    }
  }, [coordinates, currentCity, selectedLocation]);

  // Fetch professionals based on authentication status
  const { data: rawUsers = [], isLoading, error } = useQuery({
    queryKey: user ? ['/api/users/recommended'] : ['/api/users/public'],
    retry: false,
  });

  // Also fetch public professionals to always show demo data
  const { data: publicUsers = [] } = useQuery({
    queryKey: ['/api/users/public'],
    retry: false,
  });

  // Use public professionals if recommended is empty or failed
  const displayUsers = (rawUsers && Array.isArray(rawUsers) && rawUsers.length > 0) ? rawUsers : publicUsers;

  // Convert and organize professionals by categories
  const professionals = (displayUsers as any[]).map((professional: any) => {
    const distance = professional.latitude && professional.longitude && userCoordinates
      ? calculateDistance(userCoordinates.lat, userCoordinates.lon, professional.latitude, professional.longitude)
      : 0;
    
    return {
      ...professional,
      firstName: professional.firstName || '',
      lastName: professional.lastName || '',
      profileImageUrl: professional.profileImageUrl || '',
      location: professional.location || '',
      services: professional.services || [],
      distance,
    };
  });

  // Apply filters if any
  const filteredProfessionals = filters ? professionals.filter(professional => {
    if (filters.ageRange && (professional.age < filters.ageRange[0] || professional.age > filters.ageRange[1])) return false;
    if (filters.priceRange && professional.hourlyRate && (professional.hourlyRate < filters.priceRange[0] || professional.hourlyRate > filters.priceRange[1])) return false;
    if (filters.position && professional.position !== filters.position) return false;
    if (filters.bodyType && professional.bodyType !== filters.bodyType) return false;
    if (filters.ethnicity && professional.ethnicity !== filters.ethnicity) return false;
    if (filters.onlineOnly && !professional.isOnline) return false;
    if (filters.premiumOnly && !professional.isPremium) return false;
    if (filters.services && filters.services.length > 0) {
      const hasService = filters.services.some((service: string) => professional.services?.includes(service));
      if (!hasService) return false;
    }
    return true;
  }) : professionals;

  // Organize professionals: Premium first, then new, then by distance
  const premiumProfessionals = filteredProfessionals.filter(professional => professional.isPremium);
  const newProfessionals = filteredProfessionals.filter(professional => !professional.isPremium).sort((a: any, b: any) => 
    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );
  const nearbyProfessionals = [...filteredProfessionals].sort((a: any, b: any) => a.distance - b.distance);

  const handleContactProfessional = (professional: any) => {
    if (!isAuthenticated) {
      setAuthTab('register');
      setShowAuthModal(true);
      return;
    }
    navigate(`/chat?user=${professional.id}`);
  };

  // Handle location change
  const handleLocationChange = (location: string, coordinates?: { lat: number; lon: number }) => {
    console.log('HomeNew - Location changed to:', location, 'with coordinates:', coordinates);
    
    // If "Aktuellen Standort verwenden" was clicked, use GPS location
    if (location === 'Aktuellen Standort verwenden' && currentCity) {
      setSelectedLocation(currentCity);
      if (coordinates) {
        setUserCoordinates(coordinates);
      }
    } else if (location === 'Aktuellen Standort verwenden' && !currentCity) {
      // GPS is being used but city not detected yet
      setSelectedLocation('Standort wird ermittelt...');
      if (coordinates) {
        setUserCoordinates(coordinates);
      }
    } else {
      // Manual location selection
      setSelectedLocation(location);
      if (coordinates) {
        setUserCoordinates(coordinates);
      }
    }
  };

  const handleProfessionalClick = (professionalId: string) => {
    console.log('HomeNew - Clicking professional with ID:', professionalId);
    if (!isAuthenticated) {
      setAuthTab('login');
      setShowAuthModal(true);
      return;
    }
    // Use wouter navigation for instant loading without page reload
    console.log('HomeNew - Navigating to profile with ID:', professionalId);
    navigate(`/profile?id=${professionalId}`);
  };

  const ProfessionalCard = ({ professional }: { professional: any }) => (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-700"
      onClick={() => handleProfessionalClick(professional.id)}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {professional.profileImageUrl ? (
          <img
            src={professional.profileImageUrl}
            alt={professional.firstName || 'Professional Profile'}
            className="w-full h-full object-cover"
            onError={(e) => {
              // If image fails to load, show placeholder instead
              const parent = e.currentTarget.parentNode as HTMLElement;
              if (parent) {
                parent.innerHTML = '';
                const placeholderDiv = document.createElement('div');
                placeholderDiv.className = 'w-full h-full flex items-center justify-center';
                parent.appendChild(placeholderDiv);
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 dark:from-pink-800 dark:via-purple-800 dark:to-blue-800">
            <PlaceholderImage size="xl" userType="trans" className="w-24 h-24" />
          </div>
        )}
        
        {/* Online Status - Top Left */}
        {professional.isOnline && (
          <div className="absolute top-2 left-2 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm animate-pulse"></div>
        )}
        
        {/* Premium Badge - Top Right */}
        {professional.isPremium && (
          <div className="absolute top-2 right-2 bg-yellow-500/90 text-white p-1 rounded-full shadow-sm">
            <Crown className="w-3 h-3" />
          </div>
        )}

        {/* Distance - Bottom Right */}
        {professional.distance > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
            {Math.round(professional.distance)}km
          </div>
        )}
      </div>
      
      {/* Card Content - Simple and Clean */}
      <div className="p-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
            {professional.firstName}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {professional.age}
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
          <MapPin className="w-3 h-3 mr-1" />
          {professional.location}
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
            <h1 className="text-2xl font-bold text-[#FF007F]">TransEscorta</h1>
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
                className="h-8 w-8 p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" /> : <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
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
          
          {/* Premium Professionals Section */}
          {premiumProfessionals.length > 0 && (
            <section className="mb-8">
              <SectionHeader title="Premium Professionals" icon={Crown} count={premiumProfessionals.length} />
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                {premiumProfessionals.map((professional) => (
                  <ProfessionalCard key={professional.id} professional={professional} />
                ))}
              </div>
            </section>
          )}

          {/* New Professionals Section */}
          {newProfessionals.length > 0 && (
            <section className="mb-8">
              <SectionHeader title="New Professionals" icon={Star} count={newProfessionals.slice(0, 10).length} />
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                {newProfessionals.slice(0, 10).map((professional) => (
                  <ProfessionalCard key={professional.id} professional={professional} />
                ))}
              </div>
            </section>
          )}

          {/* Nearby Professionals Section */}
          {nearbyProfessionals.length > 0 && (
            <section className="mb-8">
              <SectionHeader 
                title={selectedLocation === 'Mein Standort' ? 'Professionals Nearby' : `Professionals in ${selectedLocation}`} 
                icon={MapPin} 
                count={nearbyProfessionals.length} 
              />
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                {nearbyProfessionals.map((professional) => (
                  <ProfessionalCard key={professional.id} professional={professional} />
                ))}
              </div>
            </section>
          )}

          {filteredProfessionals.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No professionals available in this region.</p>
            </div>
          )}
        </div>
      </main>
      {/* Auth Modal */}
      <AuthModalNew
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authTab}
      />
      
      {/* Test Registration Component */}

    </div>
  );
}