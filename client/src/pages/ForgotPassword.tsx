import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

const forgotPasswordSchema = z.object({
  email: z.string().email('Bitte gib eine gültige E-Mail-Adresse ein'),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      return await apiRequest('/api/auth/forgot-password', 'POST', data);
    },
    onSuccess: () => {
      setEmailSent(true);
      toast({
        title: "E-Mail versendet",
        description: "Wir haben dir einen Link zum Zurücksetzen deines Passworts gesendet.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Fehler",
        description: error.message || "Ein Fehler ist aufgetreten. Bitte versuche es erneut.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ForgotPasswordData) => {
    resetPasswordMutation.mutate(data);
  };

  const goBack = () => {
    window.location.href = '/select-type';
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FF007F]/10 to-purple-500/10 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">E-Mail versendet!</CardTitle>
            <CardDescription>
              Wir haben dir einen Link zum Zurücksetzen deines Passworts an deine E-Mail-Adresse gesendet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Nächste Schritte:</strong>
              </p>
              <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
                <li>• Überprüfe dein E-Mail-Postfach</li>
                <li>• Klicke auf den Link in der E-Mail</li>
                <li>• Erstelle ein neues Passwort</li>
                <li>• Melde dich mit dem neuen Passwort an</li>
              </ul>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              Keine E-Mail erhalten? Überprüfe auch deinen Spam-Ordner.
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={goBack}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück
              </Button>
              <Button 
                onClick={() => setEmailSent(false)}
                className="flex-1 bg-[#FF007F] hover:bg-[#FF007F]/90"
              >
                Erneut senden
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FF007F]/10 to-purple-500/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={goBack}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <CardTitle className="text-2xl">Passwort vergessen?</CardTitle>
              <CardDescription>
                Gib deine E-Mail-Adresse ein, um dein Passwort zurückzusetzen
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-Mail-Adresse</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          {...field} 
                          type="email"
                          placeholder="deine@email.com"
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-[#FF007F] hover:bg-[#FF007F]/90"
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Wird gesendet...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Reset-Link senden
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Erinnerst du dich an dein Passwort?{' '}
              <button 
                onClick={() => window.location.href = '/api/login'}
                className="text-[#FF007F] hover:underline font-medium"
              >
                Hier anmelden
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}