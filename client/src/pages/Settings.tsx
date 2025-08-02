import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';

import { useToast } from '@/hooks/use-toast';
import { ChangePasswordModal } from '@/components/ChangePasswordModal';
import { DeleteAccountModal } from '@/components/DeleteAccountModal';
import { ContactSupportModal } from '@/components/ContactSupportModal';

import { 
  User, Crown, Moon, Sun, LogOut, ChevronRight, 
  Key, Bell, Shield, HelpCircle, Smartphone, 
  Eye, EyeOff, UserX, Archive, MessageSquare,
  Volume2, VolumeX, Vibrate, Globe
} from 'lucide-react';
import AdminNavButton from '@/components/AdminNavButton';

export default function Settings() {
  const { user, isLoading } = useAuth();
  const [location, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
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
          title: t?.settingSaved || "Einstellung gespeichert",
          description: t?.privacySettingUpdated || "Deine Privatsphäre-Einstellung wurde aktualisiert.",
        });
      } catch (error) {
        console.error('Error updating privacy setting:', error);
        toast({
          title: t?.error || "Fehler",
          description: t?.settingNotSaved || "Einstellung konnte nicht gespeichert werden.",
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
            title: t?.pushNotificationsEnabled || "Push-Benachrichtigungen aktiviert",
            description: t?.pushNotificationsEnabledDesc || "Du erhältst jetzt Benachrichtigungen für neue Nachrichten.",
          });
          
          // Register service worker for push notifications
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js');
          }
        } else {
          toast({
            title: t?.permissionDenied || "Berechtigung verweigert",
            description: t?.pushNotificationsBrowserSettings || "Push-Benachrichtigungen können in den Browser-Einstellungen aktiviert werden.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Push notification error:', error);
        toast({
          title: t?.error || "Fehler",
          description: t?.pushNotificationsNotActivated || "Push-Benachrichtigungen konnten nicht aktiviert werden.",
          variant: "destructive",
        });
      }
    }
  };

  const faqItems = [
    {
      question: t?.faqVerifyProfile || "Wie kann ich mein Profil verifizieren?",
      answer: t?.faqVerifyProfileAnswer || "Premium-Mitglieder können ihr Profil durch Dokumentenupload verifizieren lassen. Dies erhöht das Vertrauen und die Sichtbarkeit."
    },
    {
      question: t?.faq24hAlbum || "Wie funktioniert die 24h Album-Freigabe?",
      answer: t?.faq24hAlbumAnswer || "Trans-Escorts können private Alben im Chat teilen. Der Empfänger hat dann 24 Stunden Zugriff auf die Fotos."
    },
    {
      question: t?.faqPremiumBenefits || "Was sind die Vorteile von Premium?",
      answer: t?.faqPremiumBenefitsAnswer || "Premium-Mitglieder haben unbegrenzte private Alben, bessere Sichtbarkeit, erweiterte Filter und Profilverifizierung."
    },
    {
      question: t?.faqReportContent || "Wie kann ich unangemessene Inhalte melden?",
      answer: t?.faqReportContentAnswer || "Verwende die Melden-Funktion in Profilen oder Chats. Unser Team prüft alle Meldungen innerhalb von 24 Stunden."
    },
    {
      question: t?.faqDataSafety || "Sind meine Daten sicher?",
      answer: t?.faqDataSafetyAnswer || "Ja, wir verwenden Ende-zu-Ende-Verschlüsselung für Nachrichten und speichern keine sensiblen Daten länger als nötig."
    },
    {
      question: t?.faqCancelPremium || "Wie kündige ich mein Premium-Abo?",
      answer: t?.faqCancelPremiumAnswer || "Premium-Abos können jederzeit über die Einstellungen oder direkt über Stripe gekündigt werden."
    }
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      toast({
        title: t?.logoutSuccess || "Erfolgreich abgemeldet",
        description: t?.logoutSuccessDesc || "Du wurdest erfolgreich abgemeldet.",
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
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{t?.settings || 'Einstellungen'}</h1>
        
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
                    {user?.userType === 'trans' ? (t?.transEscort || 'Trans Escort') : (t?.customer || 'Kunde')}
                  </p>
                  {user?.isPremium && <Badge className="bg-[#FF007F] text-white">{t?.premium || 'Premium'}</Badge>}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/my-profile')}>
                <User className="w-4 h-4 mr-2" />
                {t?.edit || 'Bearbeiten'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
{t?.account || 'Konto'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={() => setShowChangePassword(true)}
            >
              <span>{t?.changePassword || 'Passwort ändern'}</span>
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
                  <span>{user?.isPremium ? (t?.premiumActive || 'Premium aktiv') : (t?.premiumUpgrade || 'Premium Upgrade')}</span>
                  {!user?.isPremium && <Badge variant="secondary">{t?.upgrade || 'Upgrade'}</Badge>}
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}

            {/* Admin Button */}
            <AdminNavButton />
          </CardContent>
        </Card>

        {/* Push Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
{t?.pushNotifications || 'Push-Benachrichtigungen'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{t?.pushNotifications || "Push-Benachrichtigungen"}</div>
                  <div className="text-sm text-muted-foreground">
                    {t?.receiveNotifications || "Erhalte Benachrichtigungen auf deinem Gerät"}
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
                      <span className="font-medium">{t?.soundNotifications || "Ton"}</span>
                    </div>
                    <Switch 
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Vibrate className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">{t?.vibrationNotifications || "Vibration"}</span>
                    </div>
                    <Switch 
                      checked={settings.vibrationEnabled}
                      onCheckedChange={(checked) => updateSetting('vibrationEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">{t?.chatMessages || "Chat-Nachrichten"}</span>
                    </div>
                    <Switch 
                      checked={settings.chatNotifications}
                      onCheckedChange={(checked) => updateSetting('chatNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">{t?.profileVisits || "Profilbesuche"}</span>
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

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {t.language}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t.language}</div>
                <div className="text-sm text-muted-foreground">
                  Automatisch erkannt oder manuell ändern
                </div>
              </div>
              <LanguageSelector showLabel={false} />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {t?.privacy || "Privatsphäre"} & {t?.security || "Sicherheit"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{t?.showOnlineStatus || "Online-Status anzeigen"}</div>
                  <div className="text-sm text-muted-foreground">{t?.showOnlineStatusDesc || "Anderen zeigen, wenn du online bist"}</div>
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
                  <div className="font-medium">{t?.messagePreview || "Nachrichten-Vorschau"}</div>
                  <div className="text-sm text-muted-foreground">{t?.messageContentInNotifications || "Nachrichteninhalt in Benachrichtigungen"}</div>
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
                <span>{t?.exportMyData || "Meine Daten exportieren"}</span>
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
              <span>{t?.contactSupport || "Support kontaktieren"}</span>
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={() => window.open('/datenschutz', '_blank')}
            >
              <span>{t?.privacyPolicy || "Datenschutzerklärung"}</span>
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
                  <div className="font-medium text-foreground">{t?.design || "Design"}</div>
                  <div className="text-sm text-muted-foreground">
                    {theme === 'dark' ? (t?.darkModeActive || 'Dunkel-Modus aktiv') : (t?.lightModeActive || 'Hell-Modus aktiv')}
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
                <div className="font-medium">{t?.logout || "Abmelden"}</div>
                <div className="text-sm text-muted-foreground">
                  {t?.logoutDescription || "Dich von deinem Konto abmelden"}
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
  );
}