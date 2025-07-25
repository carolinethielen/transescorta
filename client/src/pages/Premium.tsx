import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Star, Zap, Eye, MessageCircle, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Premium() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = () => {
    if (!user) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Bitte melde dich an, um Premium zu aktivieren.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Einfache statische Verotel-URL ohne zusätzliche Parameter
    // Callback-URLs werden direkt in Verotel-Konfiguration gesetzt
    const verotelUrl = 'https://secure.verotel.com/startorder?description=TransEscorta+Premium+Abo&priceAmount=9.99&priceCurrency=EUR&shopID=134573&type=purchase&version=4&signature=2f500af84981e6c2919f0e0a885d40d8c552ab127b9e511b32630bf6823e410d';
    
    // Open in new tab
    window.open(verotelUrl, '_blank');

    toast({
      title: "Weiterleitung zu Verotel",
      description: "Du wirst zur sicheren Zahlungsseite weitergeleitet.",
    });

    setIsProcessing(false);
  };

  const premiumFeatures = [
    {
      icon: <Crown className="w-5 h-5 text-[#FF007F]" />,
      title: t?.premiumBadge || "Premium Badge",
      description: t?.premiumBadgeDesc || "Goldene Krone in deinem Profil für bessere Sichtbarkeit"
    },
    {
      icon: <Star className="w-5 h-5 text-[#FF007F]" />,
      title: t?.premiumSection || "Premium Sektion",
      description: t?.premiumSectionDesc || "Erscheine in der separaten Premium Escorts Sektion"
    },
    {
      icon: <Zap className="w-5 h-5 text-[#FF007F]" />,
      title: t?.priority || "Priorität",
      description: t?.priorityDesc || "Höhere Platzierung in Suchergebnissen"
    },
    {
      icon: <Eye className="w-5 h-5 text-[#FF007F]" />,
      title: t?.moreVisibility || "Mehr Sichtbarkeit",
      description: t?.moreVisibilityDesc || "Dein Profil wird häufiger angezeigt"
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-[#FF007F]" />,
      title: t?.chatPriority || "Chat Priorität",
      description: t?.chatPriorityDesc || "Deine Nachrichten werden bevorzugt angezeigt"
    },
    {
      icon: <MapPin className="w-5 h-5 text-[#FF007F]" />,
      title: t?.extendedReach || "Erweiterte Reichweite",
      description: t?.extendedReachDesc || "Sichtbar in größerem Umkreis"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center gap-2">
            <Crown className="w-8 h-8 text-[#FF007F]" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF007F] to-purple-600 bg-clip-text text-transparent">
              {t?.appName || 'TransEscorta'} {t?.premium || 'Premium'}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t?.premiumHeaderDesc || 'Steigere deine Sichtbarkeit und erhalte mehr Anfragen mit unserem Premium-Zugang'}
          </p>
        </div>

        {/* Current Status */}
        {user && (
          <Card className="border-2 border-dashed border-[#FF007F]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF007F] to-purple-600 flex items-center justify-center">
                    {user.isPremium ? (
                      <Crown className="w-6 h-6 text-white" />
                    ) : (
                      <span className="text-white font-semibold">{user.firstName?.[0] || user.email[0]}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.firstName || user.email}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.isPremium ? "default" : "secondary"}>
                        {user.isPremium ? (t?.premiumMember || "Premium Mitglied") : (t?.standardMember || "Standard Mitglied")}
                      </Badge>
                    </div>
                  </div>
                </div>
                {user.isPremium && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{t?.premiumActive || 'Premium aktiv'}</p>
                    <p className="text-xs text-green-600">{t?.oneMonthActive || '1 Monat aktiv'}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing */}
        <Card className="border-2 border-[#FF007F] shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-6 h-6 text-[#FF007F]" />
              <CardTitle className="text-2xl">{t?.premiumAccess || 'Premium Zugang'}</CardTitle>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-1">
                <span className="text-4xl font-bold text-[#FF007F]">€9,99</span>
                <span className="text-muted-foreground">{t?.oneTime || 'einmalig'}</span>
              </div>
              <CardDescription>
                {t?.oneTimePaymentDesc || 'Einmalige Zahlung für 1 Monat Premium • Keine automatische Verlängerung'}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
                  {feature.icon}
                  <div>
                    <h4 className="font-medium">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="text-center pt-4">
              {user?.isPremium ? (
                <div className="space-y-3">
                  <Button 
                    size="lg" 
                    disabled
                    className="w-full md:w-auto px-8 bg-green-600 hover:bg-green-700"
                  >
                    <Crown className="w-5 h-5 mr-2" />
                    Premium bereits aktiv
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Du genießt bereits alle Premium-Vorteile
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button 
                    size="lg" 
                    onClick={handleUpgrade}
                    disabled={isProcessing}
                    className="w-full md:w-auto px-8 bg-gradient-to-r from-[#FF007F] to-purple-600 hover:from-[#E6006B] hover:to-purple-700 text-white"
                  >
                    <Crown className="w-5 h-5 mr-2" />
                    {isProcessing ? "Weiterleitung..." : "Jetzt Premium werden"}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Sichere Zahlung über Verotel • SSL-verschlüsselt
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-white" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Sicher & Diskret</h4>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  Alle Zahlungen werden sicher über Verotel abgewickelt. Auf deiner Kreditkartenabrechnung 
                  erscheint "Verotel" - nicht "TransEscorta".
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Häufige Fragen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Verlängert sich der Zugang automatisch?</h4>
              <p className="text-sm text-muted-foreground">
                Nein, es handelt sich um eine einmalige Zahlung für 1 Monat. Keine automatische Verlängerung.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Welche Zahlungsmethoden werden akzeptiert?</h4>
              <p className="text-sm text-muted-foreground">
                Kreditkarten (Visa, Mastercard), Debitkarten und weitere lokale Zahlungsmethoden über Verotel.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Wie lange ist der Premium-Zugang gültig?</h4>
              <p className="text-sm text-muted-foreground">
                Der Premium-Zugang ist ab Aktivierung genau 1 Monat (30 Tage) gültig.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}