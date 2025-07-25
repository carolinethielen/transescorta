import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Homepage
          </Button>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Use</h1>
          <p className="text-muted-foreground">Nutzungsbedingungen für TransEscorta.com</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Allgemeine Nutzungsbedingungen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-3">1. Geltungsbereich</h3>
              <p className="text-muted-foreground leading-relaxed">
                Diese Nutzungsbedingungen gelten für die Nutzung der Plattform TransEscorta.com. 
                Mit der Registrierung und Nutzung unserer Dienste akzeptieren Sie diese Bedingungen vollständig.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">2. Dienste</h3>
              <p className="text-muted-foreground leading-relaxed">
                TransEscorta ist eine Vermittlungsplattform für Escort-Dienstleistungen. 
                Wir stellen lediglich die technische Infrastruktur zur Verfügung und sind nicht 
                Vertragspartner der zwischen Nutzern geschlossenen Vereinbarungen.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">3. Registrierung und Nutzerkonto</h3>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>• Nutzer müssen mindestens 18 Jahre alt sein</p>
                <p>• Alle Angaben müssen wahrheitsgemäß und vollständig sein</p>
                <p>• Jeder Nutzer darf nur ein Konto erstellen</p>
                <p>• Die Zugangsdaten sind vertraulich zu behandeln</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">4. Verbotene Inhalte und Aktivitäten</h3>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>• Keine Inhalte mit Minderjährigen</p>
                <p>• Keine Gewaltdarstellungen oder illegale Aktivitäten</p>
                <p>• Keine Belästigung oder Diskriminierung</p>
                <p>• Keine Verwendung gefälschter Profile oder Identitäten</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">5. Premium-Services</h3>
              <p className="text-muted-foreground leading-relaxed">
                Premium-Zugänge sind einmalige Zahlungen für 30 Tage erweiterte Funktionen. 
                Es handelt sich nicht um ein Abonnement und es erfolgt keine automatische Verlängerung.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">6. Haftungsausschluss</h3>
              <p className="text-muted-foreground leading-relaxed">
                TransEscorta übernimmt keine Haftung für Schäden, die durch die Nutzung der 
                Plattform oder durch Kontakte zwischen Nutzern entstehen. Die Nutzung erfolgt 
                auf eigene Verantwortung.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">7. Kündigung</h3>
              <p className="text-muted-foreground leading-relaxed">
                Nutzer können ihr Konto jederzeit in den Einstellungen löschen. 
                TransEscorta behält sich vor, Konten bei Verstößen gegen diese 
                Nutzungsbedingungen zu sperren.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">8. Schlussbestimmungen</h3>
              <p className="text-muted-foreground leading-relaxed">
                Es gilt deutsches Recht. Gerichtsstand ist Deutschland. 
                Sollten einzelne Bestimmungen unwirksam sein, bleibt die 
                Wirksamkeit der übrigen Bestimmungen unberührt.
              </p>
            </section>

            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Stand: {new Date().toLocaleDateString('de-DE')} | 
                TransEscorta.com | 
                Alle Rechte vorbehalten
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}