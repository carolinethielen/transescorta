import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, Crown } from 'lucide-react';

export default function PremiumDeclined() {
  const [, setLocation] = useLocation();

  const handleRetry = () => {
    setLocation('/premium');
  };

  const handleGoHome = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-4 flex items-center justify-center">
      <Card className="w-full max-w-lg border-2 border-red-200 shadow-xl">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl text-red-700 dark:text-red-400">
              Zahlung fehlgeschlagen
            </CardTitle>
            <p className="text-muted-foreground">
              Deine Zahlung konnte nicht verarbeitet werden
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
              Mögliche Gründe:
            </h4>
            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
              <li>• Unzureichende Deckung auf der Karte</li>
              <li>• Karte wurde von der Bank abgelehnt</li>
              <li>• Ungültige Kartendaten eingegeben</li>
              <li>• Internationale Zahlungen sind blockiert</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleRetry}
              className="w-full bg-gradient-to-r from-[#FF007F] to-purple-600 hover:from-[#E6006B] hover:to-purple-700 text-white"
            >
              <Crown className="w-4 h-4 mr-2" />
              Erneut versuchen
            </Button>
            
            <Button 
              onClick={handleGoHome}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zur Startseite
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Bei weiteren Problemen kontaktiere unseren Support über die Einstellungen.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}