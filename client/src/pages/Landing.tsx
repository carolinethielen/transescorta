import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Users, Shield, Crown } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF007F]/10 to-purple-500/10">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#FF007F] mb-4 font-['Poppins']">
            TransEscorta
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Premium TS-Escorts - Diskret & Professionell
          </p>
          <Button 
            size="lg"
            className="bg-[#FF007F] hover:bg-[#FF007F]/90 text-white px-8 py-3"
            onClick={() => window.location.href = '/select-type'}
          >
            Jetzt anmelden
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="w-12 h-12 text-[#FF007F] mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Authentische Verbindungen</h3>
              <p className="text-sm text-muted-foreground">
                Finde Menschen, die dich verstehen
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-[#FF007F] mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Sichere Community</h3>
              <p className="text-sm text-muted-foreground">
                Ein geschützter Raum für Trans*-Personen
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 text-[#FF007F] mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Privatsphäre</h3>
              <p className="text-sm text-muted-foreground">
                Deine Daten sind bei uns sicher
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Crown className="w-12 h-12 text-[#FF007F] mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Premium Features</h3>
              <p className="text-sm text-muted-foreground">
                Erweiterte Funktionen für bessere Matches
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Bereit für echte Verbindungen?
          </h2>
          <p className="text-muted-foreground mb-6">
            Melde dich kostenlos an und finde deine Community.
          </p>
          <Button asChild size="lg" className="bg-[#FF007F] hover:bg-[#FF007F]/90 text-white px-8">
            <Link href="/register">Jetzt registrieren</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
