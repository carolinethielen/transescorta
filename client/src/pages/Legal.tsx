import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { ArrowLeft, Scale } from 'lucide-react';

export default function Legal() {
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
          
          <div className="flex items-center gap-3 mb-4">
            <Scale className="w-8 h-8 text-[#FF007F]" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Legal Notice</h1>
              <p className="text-muted-foreground">Impressum für TransEscorta.com</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Impressum</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-3">Angaben gemäß § 5 TMG</h3>
              <div className="text-muted-foreground leading-relaxed">
                <div className="p-4 bg-muted rounded-lg space-y-1">
                  <p className="font-medium text-foreground">TransEscorta.com</p>
                  <p>Mustermann Str. 123</p>
                  <p>12345 Musterstadt</p>
                  <p>Deutschland</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Kontakt</h3>
              <div className="text-muted-foreground leading-relaxed">
                <div className="space-y-2">
                  <p><strong>E-Mail:</strong> contact@transescorta.com</p>
                  <p><strong>Telefon:</strong> +49 (0) 123 456789</p>
                  <p><strong>Support:</strong> support@transescorta.com</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Vertreten durch</h3>
              <div className="text-muted-foreground leading-relaxed">
                <p>Geschäftsführer: Max Mustermann</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Registereintrag</h3>
              <div className="text-muted-foreground leading-relaxed space-y-1">
                <p>Registergericht: Amtsgericht Musterstadt</p>
                <p>Registernummer: HRB 123456</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Umsatzsteuer-ID</h3>
              <div className="text-muted-foreground leading-relaxed">
                <p>Umsatzsteuer-Identifikationsnummer gemäß §27a Umsatzsteuergesetz:</p>
                <p className="font-mono bg-muted px-2 py-1 rounded inline-block mt-1">DE123456789</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
              <div className="text-muted-foreground leading-relaxed">
                <div className="p-3 bg-muted rounded-lg">
                  <p>Max Mustermann</p>
                  <p>Mustermann Str. 123</p>
                  <p>12345 Musterstadt</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Haftungsausschluss</h3>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Haftung für Inhalte</h4>
                  <p>
                    Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
                    nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
                    Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte 
                    fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine 
                    rechtswidrige Tätigkeit hinweisen.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">Haftung für Links</h4>
                  <p>
                    Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir 
                    keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine 
                    Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige 
                    Anbieter oder Betreiber der Seiten verantwortlich.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">Urheberrecht</h4>
                  <p>
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten 
                    unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, 
                    Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes 
                    bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Streitschlichtung</h3>
              <div className="text-muted-foreground leading-relaxed">
                <p>
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                  <a href="https://ec.europa.eu/consumers/odr/" className="text-[#FF007F] hover:underline ml-1">
                    https://ec.europa.eu/consumers/odr/
                  </a>
                </p>
                <p className="mt-2">
                  Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                  Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Plattform-Hinweise</h3>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p className="font-medium text-foreground">Wichtige rechtliche Hinweise:</p>
                <div className="space-y-2">
                  <p>• TransEscorta ist ausschließlich eine Vermittlungsplattform</p>
                  <p>• Wir sind nicht Vertragspartner der zwischen Nutzern geschlossenen Vereinbarungen</p>
                  <p>• Alle Dienstleistungen erfolgen zwischen volljährigen, einvernehmlich handelnden Personen</p>
                  <p>• Die Plattform richtet sich ausschließlich an Personen über 18 Jahren</p>
                  <p>• Escort-Services sind legale Begleitdienste im Rahmen der geltenden Gesetze</p>
                </div>
              </div>
            </section>

            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Stand: {new Date().toLocaleDateString('de-DE')} | 
                TransEscorta.com | 
                Impressum nach deutschem Recht
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}