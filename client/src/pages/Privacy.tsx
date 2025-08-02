import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { ArrowLeft, Shield } from 'lucide-react';

export default function Privacy() {
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
            <Shield className="w-8 h-8 text-[#FF007F]" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Privacy Statement</h1>
              <p className="text-muted-foreground">Datenschutzerklärung für TransEscorta.com</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Datenschutzerklärung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-3">1. Verantwortlicher</h3>
              <div className="text-muted-foreground leading-relaxed">
                <p>Verantwortlich für die Datenverarbeitung auf TransEscorta.com:</p>
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p>TransEscorta.com</p>
                  <p>E-Mail: privacy@transescorta.com</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">2. Erhobene Daten</h3>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <div>
                  <h4 className="font-medium text-foreground">Registrierungsdaten:</h4>
                  <p>E-Mail-Adresse, Benutzername, Passwort (verschlüsselt), Altersangabe</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Profildaten:</h4>
                  <p>Profilbilder, Beschreibung, Standort, Präferenzen, angebotene Services</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Nutzungsdaten:</h4>
                  <p>IP-Adresse, Browser-Informationen, Aktivitätsprotokolle, Chat-Nachrichten</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Standortdaten:</h4>
                  <p>GPS-Koordinaten (nur mit Einverständnis), gewählte Standorte</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">3. Zweck der Datenverarbeitung</h3>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>• Bereitstellung und Verbesserung unserer Services</p>
                <p>• Benutzerauthentifizierung und Kontosicherheit</p>
                <p>• Vermittlung zwischen Escort-Anbietern und Kunden</p>
                <p>• Standortbasierte Suchfunktionen</p>
                <p>• Chat- und Kommunikationsfunktionen</p>
                <p>• Betrugsprävention und Plattformsicherheit</p>
                <p>• Abwicklung von Premium-Zahlungen</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">4. Rechtsgrundlage</h3>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>• <strong>Art. 6 Abs. 1 lit. b DSGVO:</strong> Vertragserfüllung</p>
                <p>• <strong>Art. 6 Abs. 1 lit. a DSGVO:</strong> Einwilligung (Standortdaten, Marketing)</p>
                <p>• <strong>Art. 6 Abs. 1 lit. f DSGVO:</strong> Berechtigte Interessen (Sicherheit, Betrugsschutz)</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">5. Datenweitergabe</h3>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>Ihre Daten werden nur in folgenden Fällen weitergegeben:</p>
                <div className="space-y-2">
                  <p>• <strong>Zahlungsdienstleister:</strong> Verotel für Premium-Zahlungen</p>
                  <p>• <strong>Cloud-Services:</strong> Cloudinary für Bildhosting</p>
                  <p>• <strong>Behörden:</strong> Bei gesetzlicher Verpflichtung</p>
                  <p>• <strong>Andere Nutzer:</strong> Nur die in Ihrem Profil freigegebenen Informationen</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">6. Datenspeicherung</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ihre Daten werden gespeichert, solange Ihr Konto aktiv ist. 
                Nach Löschung des Kontos werden persönliche Daten binnen 30 Tagen gelöscht, 
                außer gesetzliche Aufbewahrungsfristen erfordern eine längere Speicherung.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">7. Ihre Rechte</h3>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>Sie haben folgende Rechte bezüglich Ihrer Daten:</p>
                <p>• <strong>Auskunft:</strong> Information über gespeicherte Daten</p>
                <p>• <strong>Berichtigung:</strong> Korrektur falscher Daten</p>
                <p>• <strong>Löschung:</strong> Löschung Ihrer Daten</p>
                <p>• <strong>Einschränkung:</strong> Beschränkung der Verarbeitung</p>
                <p>• <strong>Portabilität:</strong> Übertragung Ihrer Daten</p>
                <p>• <strong>Widerspruch:</strong> Widerspruch gegen Verarbeitung</p>
                <p>• <strong>Beschwerde:</strong> Bei der zuständigen Datenschutzbehörde</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">8. Cookies und Tracking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Wir verwenden Cookies zur Session-Verwaltung und Benutzerauthentifizierung. 
                Tracking-Cookies werden nur mit Ihrer Einwilligung gesetzt. 
                Sie können Cookies in Ihren Browser-Einstellungen deaktivieren.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">9. Datensicherheit</h3>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>Wir schützen Ihre Daten durch:</p>
                <p>• SSL/TLS-Verschlüsselung aller Datenübertragungen</p>
                <p>• Sichere Passwort-Verschlüsselung (bcrypt)</p>
                <p>• Regelmäßige Sicherheitsupdates</p>
                <p>• Beschränkten Mitarbeiterzugang zu Daten</p>
                <p>• Sichere Serverinfrastruktur</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">10. Kontakt</h3>
              <div className="text-muted-foreground leading-relaxed">
                <p>Bei Fragen zum Datenschutz kontaktieren Sie uns:</p>
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p>E-Mail: privacy@transescorta.com</p>
                  <p>Betreff: Datenschutzanfrage</p>
                </div>
              </div>
            </section>

            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Stand: {new Date().toLocaleDateString('de-DE')} | 
                TransEscorta.com | 
                Datenschutzerklärung nach DSGVO
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}