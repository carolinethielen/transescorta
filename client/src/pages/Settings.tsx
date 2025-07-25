import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { ChangePasswordModal } from '@/components/ChangePasswordModal';
import { DeleteAccountModal } from '@/components/DeleteAccountModal';
import { ContactSupportModal } from '@/components/ContactSupportModal';

import { 
  User, Crown, Moon, Sun, LogOut, ChevronRight, 
  Key, Bell, Shield, HelpCircle, Smartphone, 
  Eye, EyeOff, UserX, Archive, MessageSquare,
  Volume2, VolumeX, Vibrate
} from 'lucide-react';

export default function Settings() {
  const { user, isLoading } = useAuth();
  const [location, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  
  // Modal states
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showContactSupport, setShowContactSupport] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  
  // Settings states
  const [settings, setSettings] = useState({
    // Push notifications
    pushEnabled: false,
    soundEnabled: true,
    vibrationEnabled: true,
    chatNotifications: true,
    profileViewNotifications: true,
    matchNotifications: true,
    
    // Privacy & Security
    profileVisibility: 'public',
    showOnlineStatus: true,
    showLastSeen: true,
    allowMessagePreviews: true,
    twoFactorEnabled: false,
    dataExportRequested: false
  });

  // Load settings from localStorage and user data on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('transescorta-settings');
    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
    }
    
    // Load user's privacy settings from backend
    if (user) {
      setSettings(prev => ({
        ...prev,
        showOnlineStatus: user.showOnlineStatus !== false, // Default to true if not set
        showLastSeen: user.showLastSeen !== false, // Default to true if not set
        allowMessagePreviews: user.allowMessagePreviews !== false // Default to true if not set
      }));
    }
    
    // Check if push notifications are supported and enabled
    if ('Notification' in window) {
      setSettings(prev => ({
        ...prev,
        pushEnabled: Notification.permission === 'granted'
      }));
    }
  }, [user]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('transescorta-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = async (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Save privacy settings to backend
    if (['showOnlineStatus', 'showLastSeen', 'allowMessagePreviews'].includes(key)) {
      try {
        await fetch('/api/auth/update-privacy-settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ [key]: value }),
        });
        
        toast({
          title: "Einstellung gespeichert",
          description: "Deine Privatsphäre-Einstellung wurde aktualisiert.",
        });
      } catch (error) {
        console.error('Error updating privacy setting:', error);
        toast({
          title: "Fehler",
          description: "Einstellung konnte nicht gespeichert werden.",
          variant: "destructive",
        });
        // Revert the setting on error
        setSettings(prev => ({ ...prev, [key]: !value }));
      }
    }
  };

  // Request push notification permission
  const requestPushPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        updateSetting('pushEnabled', permission === 'granted');
        
        if (permission === 'granted') {
          toast({
            title: "Push-Benachrichtigungen aktiviert",
            description: "Du erhältst jetzt Benachrichtigungen für neue Nachrichten.",
          });
          
          // Register service worker for push notifications
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js');
          }
        } else {
          toast({
            title: "Berechtigung verweigert",
            description: "Push-Benachrichtigungen können in den Browser-Einstellungen aktiviert werden.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Push notification error:', error);
        toast({
          title: "Fehler",
          description: "Push-Benachrichtigungen konnten nicht aktiviert werden.",
          variant: "destructive",
        });
      }
    }
  };

  const faqItems = [
    {
      question: "Wie kann ich mein Profil verifizieren?",
      answer: "Premium-Mitglieder können ihr Profil durch Dokumentenupload verifizieren lassen. Dies erhöht das Vertrauen und die Sichtbarkeit."
    },
    {
      question: "Wie funktioniert die 24h Album-Freigabe?",
      answer: "Trans-Escorts können private Alben im Chat teilen. Der Empfänger hat dann 24 Stunden Zugriff auf die Fotos."
    },
    {
      question: "Was sind die Vorteile von Premium?",
      answer: "Premium-Mitglieder haben unbegrenzte private Alben, bessere Sichtbarkeit, erweiterte Filter und Profilverifizierung."
    },
    {
      question: "Wie kann ich unangemessene Inhalte melden?",
      answer: "Verwende die Melden-Funktion in Profilen oder Chats. Unser Team prüft alle Meldungen innerhalb von 24 Stunden."
    },
    {
      question: "Sind meine Daten sicher?",
      answer: "Ja, wir verwenden Ende-zu-Ende-Verschlüsselung für Nachrichten und speichern keine sensiblen Daten länger als nötig."
    },
    {
      question: "Wie kündige ich mein Premium-Abo?",
      answer: "Premium-Abos können jederzeit über die Einstellungen oder direkt über Stripe gekündigt werden."
    }
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      toast({
        title: "Erfolgreich abgemeldet",
        description: "Du wurdest erfolgreich abgemeldet.",
      });
      // Reload page to clear all state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Force reload even if logout fails
      window.location.href = '/';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-32"></div>
          <Card>
            <div className="p-6 space-y-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Mobile Layout */}
      <div className="md:hidden w-full bg-background p-4 pb-24">
        <div className="max-w-md mx-auto space-y-6 bg-background">
          <h1 className="text-2xl font-bold text-foreground">Einstellungen</h1>
        
        {/* User Info Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#FF007F] rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  {user?.firstName} {user?.lastName}
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    {user?.userType === 'trans' ? 'Trans Escort' : 'Kunde'}
                  </p>
                  {user?.isPremium && <Badge className="bg-[#FF007F] text-white">Premium</Badge>}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/my-profile')}>
                <User className="w-4 h-4 mr-2" />
                Bearbeiten
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Konto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={() => setShowChangePassword(true)}
            >
              <span>Passwort ändern</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
            
            {user?.userType === 'trans' && (
              <Button 
                variant="outline" 
                className={`w-full justify-between ${
                  user?.isPremium 
                    ? "border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                    : "border-[#FF007F] text-[#FF007F] hover:bg-[#FF007F]/10"
                }`}
                onClick={() => navigate('/premium')}
              >
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  <span>{user?.isPremium ? 'Premium aktiv' : 'Premium Upgrade'}</span>
                  {!user?.isPremium && <Badge variant="secondary">Upgrade</Badge>}
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Push Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Push-Benachrichtigungen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Push-Benachrichtigungen</div>
                  <div className="text-sm text-muted-foreground">
                    Erhalte Benachrichtigungen auf deinem Gerät
                  </div>
                </div>
              </div>
              <Switch 
                checked={settings.pushEnabled}
                onCheckedChange={settings.pushEnabled ? () => updateSetting('pushEnabled', false) : requestPushPermission}
              />
            </div>

            {settings.pushEnabled && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {settings.soundEnabled ? <Volume2 className="w-5 h-5 text-muted-foreground" /> : <VolumeX className="w-5 h-5 text-muted-foreground" />}
                      <span className="font-medium">Ton</span>
                    </div>
                    <Switch 
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Vibrate className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Vibration</span>
                    </div>
                    <Switch 
                      checked={settings.vibrationEnabled}
                      onCheckedChange={(checked) => updateSetting('vibrationEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Chat-Nachrichten</span>
                    </div>
                    <Switch 
                      checked={settings.chatNotifications}
                      onCheckedChange={(checked) => updateSetting('chatNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Profilbesuche</span>
                    </div>
                    <Switch 
                      checked={settings.profileViewNotifications}
                      onCheckedChange={(checked) => updateSetting('profileViewNotifications', checked)}
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privatsphäre & Sicherheit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Online-Status anzeigen</div>
                  <div className="text-sm text-muted-foreground">Anderen zeigen, wenn du online bist</div>
                </div>
              </div>
              <Switch 
                checked={settings.showOnlineStatus}
                onCheckedChange={(checked) => updateSetting('showOnlineStatus', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Zuletzt gesehen</div>
                  <div className="text-sm text-muted-foreground">Zeige, wann du zuletzt online warst</div>
                </div>
              </div>
              <Switch 
                checked={settings.showLastSeen}
                onCheckedChange={(checked) => updateSetting('showLastSeen', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Nachrichten-Vorschau</div>
                  <div className="text-sm text-muted-foreground">Nachrichteninhalt in Benachrichtigungen</div>
                </div>
              </div>
              <Switch 
                checked={settings.allowMessagePreviews}
                onCheckedChange={(checked) => updateSetting('allowMessagePreviews', checked)}
              />
            </div>

            <Separator />

            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={() => {
                toast({
                  title: "Datenexport",
                  description: "Ein Download-Link wird an deine E-Mail gesendet.",
                });
              }}
            >
              <div className="flex items-center gap-2">
                <Archive className="w-4 h-4" />
                <span>Meine Daten exportieren</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button 
              variant="destructive" 
              className="w-full justify-between"
              onClick={() => setShowDeleteAccount(true)}
            >
              <div className="flex items-center gap-2">
                <UserX className="w-4 h-4" />
                <span>Konto löschen</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>



        {/* Help & Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Hilfe & Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={() => setShowFAQ(true)}
            >
              <span>Häufige Fragen (FAQ)</span>
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={() => setShowContactSupport(true)}
            >
              <span>Support kontaktieren</span>
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={() => window.open('/datenschutz', '_blank')}
            >
              <span>Datenschutzerklärung</span>
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={() => window.open('/agb', '_blank')}
            >
              <span>Allgemeine Geschäftsbedingungen</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Theme Toggle */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {theme === 'dark' ? <Moon className="w-5 h-5 text-muted-foreground" /> : <Sun className="w-5 h-5 text-muted-foreground" />}
                <div>
                  <div className="font-medium text-foreground">Design</div>
                  <div className="text-sm text-muted-foreground">
                    {theme === 'dark' ? 'Dunkel-Modus aktiv' : 'Hell-Modus aktiv'}
                  </div>
                </div>
              </div>
              <Switch 
                checked={theme === 'dark'} 
                onCheckedChange={toggleTheme}
              />
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Card>
          <CardContent className="p-0">
            <button
              onClick={handleLogout}
              className="w-full p-4 text-left flex items-center space-x-3 hover:bg-destructive/10 transition-colors rounded-lg text-destructive"
            >
              <LogOut className="w-5 h-5" />
              <div>
                <div className="font-medium">Abmelden</div>
                <div className="text-sm text-muted-foreground">
                  Dich von deinem Konto abmelden
                </div>
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Modals */}
        <ChangePasswordModal 
          open={showChangePassword} 
          onOpenChange={setShowChangePassword} 
        />
        
        <DeleteAccountModal 
          open={showDeleteAccount} 
          onOpenChange={setShowDeleteAccount} 
        />
        
        <ContactSupportModal 
          open={showContactSupport} 
          onOpenChange={setShowContactSupport} 
        />

        {/* FAQ Modal */}
        {showFAQ && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg max-h-[80vh] flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between flex-shrink-0">
                <CardTitle>Häufige Fragen</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowFAQ(false)}>
                  ✕
                </Button>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-4">
                {faqItems.map((item, index) => (
                  <Card key={index} className="p-4">
                    <h4 className="font-medium mb-2">{item.question}</h4>
                    <p className="text-sm text-muted-foreground">{item.answer}</p>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Einstellungen</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* User Info Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#FF007F] to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground">
                        {user?.firstName} {user?.lastName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-muted-foreground">
                          {user?.userType === 'trans' ? 'Trans Escort' : 'Kunde'}
                        </p>
                        {user?.isPremium && <Badge className="bg-[#FF007F] text-white">Premium</Badge>}
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => navigate('/my-profile')}>
                      <User className="w-4 h-4 mr-2" />
                      Profil bearbeiten
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Konto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                    onClick={() => setShowChangePassword(true)}
                  >
                    <span>Passwort ändern</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  
                  {user?.userType === 'trans' && (
                    <Button 
                      variant="outline" 
                      className={`w-full justify-between ${
                        user?.isPremium 
                          ? "border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                          : "border-[#FF007F] text-[#FF007F] hover:bg-[#FF007F]/10"
                      }`}
                      onClick={() => navigate('/premium')}
                    >
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4" />
                        <span>{user?.isPremium ? 'Premium aktiv' : 'Premium Upgrade'}</span>
                        {!user?.isPremium && <Badge variant="secondary">Upgrade</Badge>}
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Push Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Push-Benachrichtigungen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Push-Benachrichtigungen</div>
                        <div className="text-sm text-muted-foreground">
                          Erhalte Benachrichtigungen auf deinem Gerät
                        </div>
                      </div>
                    </div>
                    <Switch 
                      checked={settings.pushEnabled}
                      onCheckedChange={settings.pushEnabled ? () => updateSetting('pushEnabled', false) : requestPushPermission}
                    />
                  </div>

                  {settings.pushEnabled && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {settings.soundEnabled ? <Volume2 className="w-5 h-5 text-muted-foreground" /> : <VolumeX className="w-5 h-5 text-muted-foreground" />}
                            <span className="font-medium">Ton</span>
                          </div>
                          <Switch 
                            checked={settings.soundEnabled}
                            onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <MessageSquare className="w-5 h-5 text-muted-foreground" />
                            <span className="font-medium">Chat-Nachrichten</span>
                          </div>
                          <Switch 
                            checked={settings.chatNotifications}
                            onCheckedChange={(checked) => updateSetting('chatNotifications', checked)}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* More Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    Mehr
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <button 
                    className="w-full text-left flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    onClick={() => setShowFAQ(true)}
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Häufige Fragen</div>
                        <div className="text-sm text-muted-foreground">
                          Antworten auf häufige Fragen
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button 
                    className="w-full text-left flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    onClick={() => setShowContactSupport(true)}
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Support kontaktieren</div>
                        <div className="text-sm text-muted-foreground">
                          Hilfe und Unterstützung erhalten
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <Separator />

                  <button 
                    className="w-full text-left flex items-center justify-between p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600"
                    onClick={handleLogout}
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="w-5 h-5" />
                      <div>
                        <div className="font-medium">Abmelden</div>
                        <div className="text-sm text-red-500">
                          Dich von deinem Konto abmelden
                        </div>
                      </div>
                    </div>
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Modals */}
          <ChangePasswordModal 
            open={showChangePassword} 
            onOpenChange={setShowChangePassword} 
          />
          
          <DeleteAccountModal 
            open={showDeleteAccount} 
            onOpenChange={setShowDeleteAccount} 
          />
          
          <ContactSupportModal 
            open={showContactSupport} 
            onOpenChange={setShowContactSupport} 
          />

          {/* FAQ Modal */}
          {showFAQ && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between flex-shrink-0">
                  <CardTitle>Häufige Fragen</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowFAQ(false)}>
                    ✕
                  </Button>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {faqItems.map((item, index) => (
                      <Card key={index} className="p-4">
                        <h4 className="font-medium mb-2">{item.question}</h4>
                        <p className="text-sm text-muted-foreground">{item.answer}</p>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}