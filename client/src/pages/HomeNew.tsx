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
    if (filters.cockSizeRange && escort.cockSize && (escort.cockSize < filters.cockSizeRange[0] || escort.cockSize > filters.cockSizeRange[1])) return false;
    if (filters.position && filters.position !== 'all' && escort.position !== filters.position) return false;
    if (filters.bodyType && filters.bodyType !== 'all' && escort.bodyType !== filters.bodyType) return false;
    if (filters.ethnicity && filters.ethnicity !== 'all' && escort.ethnicity !== filters.ethnicity) return false;
    if (filters.circumcision && filters.circumcision !== 'all' && escort.circumcision !== filters.circumcision) return false;
    if (filters.onlineOnly && !escort.isOnline) return false;
    if (filters.premiumOnly && !escort.isPremium) return false;
    if (filters.services && filters.services.length > 0) {
      const hasService = filters.services.some((service: string) => escort.services?.includes(service));
      if (!hasService) return false;
    }
    return true;
  }) : escorts;

  // Organize escorts like hunqz.com: Premium first, then new, then by distance
  // Apply limits: max 6 Premium, max 4 New, max 40 Nearby
  const premiumEscorts = filteredEscorts.filter(escort => escort.isPremium).slice(0, 6);
  const newEscorts = filteredEscorts.filter(escort => !escort.isPremium)
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 4);
  const nearbyEscorts = [...filteredEscorts].sort((a, b) => a.distance - b.distance).slice(0, 40);

  const handleContactEscort = (escort: any) => {
    if (!isAuthenticated) {
      setAuthTab('register');
      setShowAuthModal(true);
      return;
    }
    navigate(`/chat?user=${escort.id}`);
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

  const handleEscortClick = (escortId: string) => {
    console.log('HomeNew - Clicking escort with ID:', escortId);
    if (!isAuthenticated) {
      setAuthTab('login');
      setShowAuthModal(true);
      return;
    }
    // Use wouter navigation for instant loading without page reload
    console.log('HomeNew - Navigating to profile with ID:', escortId);
    navigate(`/profile?id=${escortId}`);
  };

  const EscortCard = ({ escort }: { escort: any }) => (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-700"
      onClick={() => handleEscortClick(escort.id)}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {escort.profileImageUrl ? (
          <img
            src={escort.profileImageUrl}
            alt={escort.firstName || 'Escort Profile'}
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
        {escort.isOnline && (
          <div className="absolute top-2 left-2 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm animate-pulse"></div>
        )}
        
        {/* Premium Badge - Top Right */}
        {escort.isPremium && (
          <div className="absolute top-2 right-2 bg-yellow-500/90 text-white p-1 rounded-full shadow-sm">
            <Crown className="w-3 h-3" />
          </div>
        )}

        {/* Distance - Bottom Right */}
        {escort.distance > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
            {Math.round(escort.distance)}km
          </div>
        )}
      </div>
      
      {/* Card Content - Simple and Clean */}
      <div className="p-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
            {escort.firstName}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {escort.age}
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
          <MapPin className="w-3 h-3 mr-1" />
          {escort.location}
        </div>
      </div>
    </div>
  );

  const SectionHeader = ({ title, icon: Icon }: { title: string; icon: any }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-[#FF007F]" />
        <h2 className="text-xl font-semibold">{title}</h2>
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
            <h1 className="text-xl font-bold text-[#FF007F]">TransEscorta</h1>
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
          
          {/* Premium Escorts Section */}
          {premiumEscorts.length > 0 && (
            <section className="mb-8">
              <SectionHeader title="Premium Escorts" icon={Crown} />
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                {premiumEscorts.map((escort) => (
                  <EscortCard key={escort.id} escort={escort} />
                ))}
              </div>
            </section>
          )}

          {/* New Escorts Section */}
          {newEscorts.length > 0 && (
            <section className="mb-8">
              <SectionHeader title="Neue Escorts" icon={Star} />
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                {newEscorts.map((escort) => (
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
              />
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
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

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center space-y-4">
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-[#FF007F] transition-colors">
                Terms of Use
              </a>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <a href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-[#FF007F] transition-colors">
                Privacy Statement
              </a>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <a href="/legal" className="text-gray-600 dark:text-gray-400 hover:text-[#FF007F] transition-colors">
                Legal Notice
              </a>
            </div>
            
            {/* Copyright */}
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} TransEscorta.com - All rights reserved
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModalNew
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authTab}
      />

    </div>
  );
}