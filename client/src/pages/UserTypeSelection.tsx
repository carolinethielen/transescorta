import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { Heart, Users, ArrowLeft } from 'lucide-react';

export default function UserTypeSelection() {
  const [selectedType, setSelectedType] = useState<'trans' | 'man' | null>(null);
  const { toast } = useToast();
  const [location, navigate] = useLocation();

  const handleTypeSelection = (userType: 'trans' | 'man') => {
    setSelectedType(userType);
  };

  const handleContinue = () => {
    if (!selectedType) {
      toast({
        title: "Auswahl erforderlich",
        description: "Bitte wähle deinen Benutzertyp aus",
        variant: "destructive",
      });
      return;
    }

    // Store user type in localStorage for registration process
    localStorage.setItem('selectedUserType', selectedType);
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF007F]/10 to-purple-500/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Startseite
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#FF007F] mb-2 font-['Poppins']">
            TransConnect
          </h1>
          <p className="text-muted-foreground">
            Bist du Trans*-Escort oder suchst du Services?
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {/* Trans User Option */}
          <Card 
            className={`cursor-pointer transition-all ${
              selectedType === 'trans' 
                ? 'ring-2 ring-[#FF007F] bg-[#FF007F]/5' 
                : 'hover:bg-muted/50'
            }`}
            onClick={() => handleTypeSelection('trans')}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#FF007F]/20 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-[#FF007F]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Als Trans*-Escort anmelden</h3>
                  <p className="text-sm text-muted-foreground">
                    Biete deine Services an - dein Profil wird öffentlich im Grid gezeigt
                  </p>
                </div>
                {selectedType === 'trans' && (
                  <div className="w-6 h-6 bg-[#FF007F] rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Man User Option */}
          <Card 
            className={`cursor-pointer transition-all ${
              selectedType === 'man' 
                ? 'ring-2 ring-[#FF007F] bg-[#FF007F]/5' 
                : 'hover:bg-muted/50'
            }`}
            onClick={() => handleTypeSelection('man')}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#FF007F]/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#FF007F]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Als Kunde anmelden</h3>
                  <p className="text-sm text-muted-foreground">
                    Durchstöbere Profile, chatte mit Escorts - erscheinst nicht im Grid
                  </p>
                </div>
                {selectedType === 'man' && (
                  <div className="w-6 h-6 bg-[#FF007F] rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Button 
          onClick={handleContinue}
          className="w-full bg-[#FF007F] hover:bg-[#FF007F]/90 text-white py-3"
          size="lg"
          disabled={!selectedType}
        >
          Weiter zur Anmeldung
        </Button>

        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Bereits registriert?{' '}
            <button 
              onClick={() => window.location.href = '/api/login'}
              className="text-[#FF007F] hover:underline font-medium"
            >
              Hier anmelden
            </button>
          </p>
          
          <p className="text-xs text-muted-foreground">
            <button 
              onClick={() => navigate('/forgot-password')}
              className="text-[#FF007F] hover:underline"
            >
              Passwort vergessen?
            </button>
          </p>
          
          <p className="text-xs text-muted-foreground">
            Durch die Anmeldung stimmst du unseren Nutzungsbedingungen zu
          </p>
        </div>
      </div>
    </div>
  );
}