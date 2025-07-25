import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { executeRecaptcha } from '@/utils/recaptcha';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, Eye, EyeOff, Shield, Lock } from 'lucide-react';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';

// Dynamic schema creation with translations
const createLoginSchema = (t: any) => z.object({
  email: z.string().email(t?.invalidEmail || 'Ungültige E-Mail-Adresse'),
  password: z.string().min(6, t?.passwordMinLength || 'Passwort muss mindestens 6 Zeichen lang sein'),
});

const createRegisterSchema = (t: any) => z.object({
  email: z.string().email(t?.invalidEmail || 'Ungültige E-Mail-Adresse'),
  password: z.string().min(6, t?.passwordMinLength || 'Passwort muss mindestens 6 Zeichen lang sein'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, t?.usernameRequired || 'Benutzername ist erforderlich'),
  lastName: z.string().optional(),
  userType: z.enum(['trans', 'man'], {
    required_error: t?.selectUserType || 'Bitte wähle deinen Kontotyp',
  }),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: t?.acceptTermsRequired || 'Du musst die Nutzungsbedingungen und Datenschutzerklärung akzeptieren',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: t?.passwordsNoMatch || 'Passwörter stimmen nicht überein',
  path: ['confirmPassword'],
});

type LoginForm = z.infer<ReturnType<typeof createLoginSchema>>;
type RegisterForm = z.infer<ReturnType<typeof createRegisterSchema>>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export default function AuthModalNew({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(createRegisterSchema(t)),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      userType: undefined as any,
      acceptTerms: false,
    },
  });

  // Direct fetch implementation with reCAPTCHA
  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      // Get reCAPTCHA token first
      let recaptchaToken;
      try {
        recaptchaToken = await executeRecaptcha('login');
      } catch (error) {
        throw new Error('reCAPTCHA-Verifikation fehlgeschlagen');
      }

      // Use XMLHttpRequest as fallback to avoid any fetch conflicts
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/auth/login', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.withCredentials = true;
        
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const result = JSON.parse(xhr.responseText);
              resolve(result);
            } catch (e) {
              reject(new Error('Invalid JSON response'));
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText);
              reject(new Error(errorData.message || 'Login failed'));
            } catch (e) {
              reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
            }
          }
        };
        
        xhr.onerror = function() {
          reject(new Error('Network error'));
        };
        
        xhr.send(JSON.stringify({ ...data, recaptchaToken }));
      });
    },
    onSuccess: (data: any) => {
      toast({
        title: t?.loginSuccess || "Anmeldung erfolgreich!",
        description: `${t?.welcomeBack || 'Willkommen zurück'}, ${data.user?.firstName || 'User'}!`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: t?.loginFailed || "Anmeldung fehlgeschlagen",
        description: error.message || (t?.invalidCredentials || "Ungültige E-Mail oder Passwort."),
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      const { confirmPassword, acceptTerms, ...registerData } = data;
      
      // Get reCAPTCHA token first
      let recaptchaToken;
      try {
        recaptchaToken = await executeRecaptcha('register');
      } catch (error) {
        throw new Error('reCAPTCHA-Verifikation fehlgeschlagen');
      }
      
      // Use XMLHttpRequest as fallback to avoid any fetch conflicts
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/auth/register', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.withCredentials = true;
        
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const result = JSON.parse(xhr.responseText);
              resolve(result);
            } catch (e) {
              reject(new Error('Invalid JSON response'));
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText);
              reject(new Error(errorData.message || 'Registration failed'));
            } catch (e) {
              reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
            }
          }
        };
        
        xhr.onerror = function() {
          reject(new Error('Network error'));
        };
        
        xhr.send(JSON.stringify({ ...registerData, recaptchaToken }));
      });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Registrierung erfolgreich!",
        description: data.message || "Willkommen bei TransEscorta!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Registrierung fehlgeschlagen",
        description: error.message || "Ein Fehler ist aufgetreten.",
        variant: "destructive",
      });
    },
  });

  const onLoginSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterForm) => {
    registerMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-[#FF007F] p-3 rounded-full">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold">TransEscorta</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t?.login || 'Anmelden'}</TabsTrigger>
            <TabsTrigger value="register">{t?.register || 'Registrieren'}</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-Mail *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="deine@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t?.password || 'Passwort'} *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder={t?.passwordPlaceholder || "Dein Passwort"}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#FF007F] hover:bg-[#FF007F]/90"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (t?.loggingIn || 'Anmelden...') : (t?.login || 'Anmelden')}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t?.iAm || 'Ich bin'} *</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-4">
                          <div
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              field.value === 'trans'
                                ? 'border-[#FF007F] bg-[#FF007F]/10'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => field.onChange('trans')}
                          >
                            <div className="text-center">
                              <div className="text-lg font-semibold text-[#FF007F]">💄</div>
                              <div className="font-medium">{t?.transEscort || 'Trans Escort'}</div>
                              <div className="text-sm text-gray-500">{t?.transEscortDesc || 'Ich biete Services an'}</div>
                            </div>
                          </div>
                          <div
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              field.value === 'man'
                                ? 'border-[#FF007F] bg-[#FF007F]/10'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => field.onChange('man')}
                          >
                            <div className="text-center">
                              <div className="text-lg font-semibold text-[#FF007F]">👤</div>
                              <div className="font-medium">{t?.customer || 'Kunde'}</div>
                              <div className="text-sm text-gray-500">{t?.customerDesc || 'Ich suche Services'}</div>
                            </div>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t?.username || 'Benutzername'} *</FormLabel>
                      <FormControl>
                        <Input placeholder={t?.usernamePlaceholder || "Dein Benutzername"} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-Mail *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="deine@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passwort *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Mindestens 6 Zeichen"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passwort bestätigen *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Passwort wiederholen"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Security Information */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 space-y-2">
                  <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">Sicher & Verschlüsselt</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                    <Lock className="w-4 h-4" />
                    <span className="text-xs">Deine Daten werden SSL-verschlüsselt und sicher gespeichert</span>
                  </div>
                </div>

                {/* Terms & Privacy Checkbox */}
                <FormField
                  control={registerForm.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <div className="text-sm">
                          Ich akzeptiere die{' '}
                          <Link href="/terms" className="text-[#FF007F] hover:underline font-medium">
                            Nutzungsbedingungen
                          </Link>{' '}
                          und{' '}
                          <Link href="/privacy" className="text-[#FF007F] hover:underline font-medium">
                            Datenschutzerklärung
                          </Link>
                        </div>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#FF007F] hover:bg-[#FF007F]/90"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? 'Registrieren...' : 'Registrieren'}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}