import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Mail, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function VerifyEmail() {
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  // Get token from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  const verifyEmailMutation = useMutation({
    mutationFn: async (token: string) => {
      return await apiRequest('/api/auth/verify-email', 'POST', { token });
    },
    onSuccess: () => {
      setVerificationStatus('success');
      toast({
        title: "E-Mail erfolgreich verifiziert",
        description: "Dein Account ist jetzt aktiv. Du kannst dich anmelden.",
      });
    },
    onError: (error: any) => {
      setVerificationStatus('error');
      setErrorMessage(error.message || 'Der Verifizierungslink ist ungültig oder abgelaufen.');
      toast({
        title: "Verifizierung fehlgeschlagen",
        description: error.message || "Der Link ist möglicherweise abgelaufen.",
        variant: "destructive",
      });
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/auth/resend-verification', 'POST');
    },
    onSuccess: () => {
      toast({
        title: "Verifizierungs-E-Mail gesendet",
        description: "Wir haben dir eine neue Verifizierungs-E-Mail gesendet.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Fehler",
        description: error.message || "E-Mail konnte nicht gesendet werden.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (token) {
      verifyEmailMutation.mutate(token);
    } else {
      setVerificationStatus('error');
      setErrorMessage('Kein Verifizierungstoken gefunden.');
    }
  }, [token]);

  const handleResendVerification = () => {
    resendVerificationMutation.mutate();
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
              <CardTitle className="text-2xl">E-Mail wird verifiziert...</CardTitle>
              <CardDescription>
                Bitte warte einen Moment, während wir deine E-Mail-Adresse verifizieren.
              </CardDescription>
            </CardHeader>
          </Card>
        );

      case 'success':
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl text-green-600 dark:text-green-400">
                E-Mail erfolgreich verifiziert!
              </CardTitle>
              <CardDescription>
                Dein Account ist jetzt aktiv. Du kannst dich anmelden und die Plattform nutzen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>Willkommen bei TransConnect!</strong>
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Du kannst jetzt alle Funktionen der Plattform nutzen und mit anderen Mitgliedern in Kontakt treten.
                </p>
              </div>

              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="w-full bg-[#FF007F] hover:bg-[#FF007F]/90"
              >
                Zur Anmeldung
              </Button>
            </CardContent>
          </Card>
        );

      case 'error':
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-2xl text-red-600 dark:text-red-400">
                Verifizierung fehlgeschlagen
              </CardTitle>
              <CardDescription>
                {errorMessage}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                  Mögliche Ursachen:
                </p>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  <li>• Der Verifizierungslink ist abgelaufen</li>
                  <li>• Der Link wurde bereits verwendet</li>
                  <li>• Der Link ist beschädigt oder unvollständig</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/select-type'}
                  className="flex-1"
                >
                  Zur Registrierung
                </Button>
                <Button 
                  onClick={handleResendVerification}
                  disabled={resendVerificationMutation.isPending}
                  className="flex-1 bg-[#FF007F] hover:bg-[#FF007F]/90"
                >
                  {resendVerificationMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Erneut senden
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FF007F]/10 to-purple-500/10 p-4">
      {renderContent()}
    </div>
  );
}