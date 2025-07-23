import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Crown, Check, Star, Heart, MessageCircle, Eye, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function Subscribe() {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleUpgrade = async () => {
    try {
      const response = await fetch('/api/upgrade-premium', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        toast({
          title: "Premium aktiviert!",
          description: "Du hast jetzt Zugang zu allen Premium-Funktionen",
        });
        // Redirect to home or profile
        window.location.href = '/';
      } else {
        throw new Error('Upgrade failed');
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Premium-Upgrade fehlgeschlagen",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück
          </Button>
        </Link>
      </div>

      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-[#FF007F] to-purple-500 rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Premium werden</h1>
          <p className="text-muted-foreground">
            Schalte alle erweiterten Funktionen frei und finde deine perfekte Verbindung
          </p>
        </div>

        {/* Premium Features */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-[#FF007F]">Premium Funktionen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#FF007F]/20 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-[#FF007F]" />
              </div>
              <div>
                <h3 className="font-semibold">Unbegrenzte Likes</h3>
                <p className="text-sm text-muted-foreground">Like so viele Profile wie du möchtest</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#FF007F]/20 rounded-full flex items-center justify-center">
                <Eye className="w-4 h-4 text-[#FF007F]" />
              </div>
              <div>
                <h3 className="font-semibold">Wer hat dich geliked</h3>
                <p className="text-sm text-muted-foreground">Sieh wer dich bereits geliked hat</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#FF007F]/20 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-[#FF007F]" />
              </div>
              <div>
                <h3 className="font-semibold">Boost dein Profil</h3>
                <p className="text-sm text-muted-foreground">Sei öfter in den Top-Profilen zu sehen</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#FF007F]/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-[#FF007F]" />
              </div>
              <div>
                <h3 className="font-semibold">Priorität im Chat</h3>
                <p className="text-sm text-muted-foreground">Deine Nachrichten werden priorisiert</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="mb-6 bg-gradient-to-r from-[#FF007F]/10 to-purple-500/10 border-[#FF007F]/30">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <div className="text-3xl font-bold text-[#FF007F]">DEMO</div>
              <div className="text-sm text-muted-foreground">Kostenloses Premium für Tests</div>
            </div>
            
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-[#FF007F] hover:bg-[#FF007F]/90 text-white font-semibold py-3"
              size="lg"
            >
              <Crown className="w-5 h-5 mr-2" />
              Jetzt Premium werden (Demo)
            </Button>
            
            <p className="text-xs text-muted-foreground mt-4">
              * Dies ist eine Demo-Version ohne echte Zahlungen
            </p>
          </CardContent>
        </Card>

        {/* Already Premium */}
        {user?.isPremium && (
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Crown className="w-8 h-8 text-[#FF007F] mx-auto mb-2" />
            <p className="font-semibold text-green-800 dark:text-green-200">
              Du bist bereits Premium!
            </p>
            <p className="text-sm text-green-600 dark:text-green-300">
              Genieße alle erweiterten Funktionen
            </p>
          </div>
        )}
      </div>
    </div>
  );
}