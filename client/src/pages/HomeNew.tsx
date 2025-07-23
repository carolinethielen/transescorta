import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from '@/hooks/useLocation';
import { MapPin, Moon, Sun, MessageCircle, Crown, Star, Clock, ChevronDown } from 'lucide-react';
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
  const [selectedCity, setSelectedCity] = useState('Berlin');
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const { location } = useLocation();
  const queryClient = useQueryClient();

  // German cities with coordinates
  const cities = [
    { name: 'Berlin', lat: 52.5200, lon: 13.4050 },
    { name: 'Hamburg', lat: 53.5511, lon: 9.9937 },
    { name: 'München', lat: 48.1351, lon: 11.5820 },
    { name: 'Köln', lat: 50.9375, lon: 6.9603 },
    { name: 'Frankfurt', lat: 50.1109, lon: 8.6821 },
    { name: 'Stuttgart', lat: 48.7758, lon: 9.1829 },
    { name: 'Düsseldorf', lat: 51.2277, lon: 6.7735 },
  ];

  // Fetch escorts based on authentication status
  const { data: rawUsers = [], isLoading, error } = useQuery({
    queryKey: user ? ['/api/users/recommended'] : ['/api/users/public'],
    retry: false,
  });

  // Convert and organize escorts by categories
  const escorts = (rawUsers as any[]).map((escort: any) => {
    const distance = escort.latitude && escort.longitude && location?.latitude && location?.longitude
      ? calculateDistance(location.latitude, location.longitude, escort.latitude, escort.longitude)
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

  const EscortCard = ({ escort }: { escort: any }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="relative">
        <img
          src={escort.profileImageUrl || 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400'}
          alt={escort.firstName || 'Escort Profile'}
          className="w-full h-48 object-cover"
        />
        {escort.isPremium && (
          <Crown className="absolute top-2 right-2 w-6 h-6 text-yellow-500 bg-black/50 p-1 rounded" />
        )}
        {escort.isOnline && (
          <div className="absolute top-2 left-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-white font-semibold text-lg">{escort.firstName}</h3>
          <p className="text-white/90 text-sm">
            {escort.age} Jahre • {escort.location}
            {escort.distance > 0 && ` • ${Math.round(escort.distance)}km`}
          </p>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-1 mb-3">
          {escort.services?.slice(0, 3).map((service, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {service}
            </Badge>
          ))}
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-3">
          <div>Größe: {escort.height || '-'}cm</div>
          <div>Gewicht: {escort.weight || '-'}kg</div>
          <div>Position: {escort.position || '-'}</div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-semibold text-[#FF007F]">
            {escort.hourlyRate ? `${escort.hourlyRate}€/h` : 'Preis auf Anfrage'}
          </span>
          <Button
            size="sm"
            onClick={() => handleContactEscort(escort)}
            className="bg-[#FF007F] hover:bg-[#FF007F]/90"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
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
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-[#FF007F] font-['Poppins']">TransConnect</h1>
          
          <div className="flex items-center space-x-3">
            {/* City Selector */}
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-32">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-[#FF007F] mr-1" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-full"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Premium Escorts Section */}
        {premiumEscorts.length > 0 && (
          <section>
            <SectionHeader title="Premium Escorts" icon={Crown} count={premiumEscorts.length} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {premiumEscorts.map((escort) => (
                <EscortCard key={escort.id} escort={escort} />
              ))}
            </div>
          </section>
        )}

        {/* New Escorts Section */}
        {newEscorts.length > 0 && (
          <section>
            <SectionHeader title="Neue Escorts" icon={Star} count={newEscorts.slice(0, 8).length} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {newEscorts.slice(0, 8).map((escort) => (
                <EscortCard key={escort.id} escort={escort} />
              ))}
            </div>
          </section>
        )}

        {/* Nearby Escorts Section */}
        {nearbyEscorts.length > 0 && (
          <section>
            <SectionHeader title={`Escorts in ${selectedCity}`} icon={MapPin} count={nearbyEscorts.length} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {nearbyEscorts.map((escort) => (
                <EscortCard key={escort.id} escort={escort} />
              ))}
            </div>
          </section>
        )}

        {escorts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Keine Escorts in dieser Region verfügbar.</p>
          </div>
        )}
      </main>
    </div>
  );
}