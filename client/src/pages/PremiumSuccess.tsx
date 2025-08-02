import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Check, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PremiumSuccess() {
  const [, setLocation] = useLocation();
  const { user, refetch } = useAuth();
  const { toast } = useToast();
  const [isActivating, setIsActivating] = useState(true);

  useEffect(() => {
    const activatePremium = async () => {
      try {
        // Wait a moment for the webhook to process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Refetch user data to check if premium was activated
        await refetch();
        
        setIsActivating(false);
        
        toast({
          title: "Premium aktiviert!",
          description: "Willkommen bei TransEscorta Premium. Alle Vorteile sind jetzt verfügbar.",
        });
      } catch (error) {
        console.error('Error activating premium:', error);
        setIsActivating(false);
      }
    };

    activatePremium();
  }, [refetch, toast]);

  const handleContinue = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 flex items-center justify-center">
      <Card className="w-full max-w-lg border-2 border-green-200 shadow-xl">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-[#FF007F] to-purple-600 rounded-full flex items-center justify-center">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl text-green-700 dark:text-green-400">
              Zahlung erfolgreich!
            </CardTitle>
            <p className="text-muted-foreground">
              {isActivating 
                ? "Premium wird aktiviert..." 
                : "Willkommen bei TransEscorta Premium"
              }
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {isActivating ? (
            <div className="text-center space-y-4">
              <div className="animate-spin w-8 h-8 border-4 border-[#FF007F] border-t-transparent rounded-full mx-auto"></div>
              <p className="text-sm text-muted-foreground">
                Dein Premium-Status wird aktiviert...
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Check className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-medium">Premium Badge</h4>
                    <p className="text-sm text-muted-foreground">Goldene Krone in deinem Profil</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Check className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-medium">Premium Sektion</h4>
                    <p className="text-sm text-muted-foreground">Erscheine unter Premium Escorts</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Check className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-medium">Höhere Sichtbarkeit</h4>
                    <p className="text-sm text-muted-foreground">Priorität in Suchergebnissen</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  <strong>Nächste Schritte:</strong> Dein Premium-Status ist jetzt aktiv. 
                  Du findest dich ab sofort in der Premium Escorts Sektion auf der Startseite.
                </p>
              </div>

              <Button 
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-[#FF007F] to-purple-600 hover:from-[#E6006B] hover:to-purple-700 text-white"
              >
                Zur Startseite
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}