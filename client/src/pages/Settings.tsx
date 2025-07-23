import React from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';

import { 
  User, Crown, Moon, Sun, LogOut, ChevronRight, 
  Key, Bell, Shield, HelpCircle 
} from 'lucide-react';

export default function Settings() {
  const { user, isLoading } = useAuth();
  const [location, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

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

  // Settings items based on user type
  const getSettingsItems = () => {
    const baseSettings = [
      {
        title: "Profil bearbeiten",
        description: "Deine persönlichen Informationen verwalten",
        icon: User,
        onClick: () => navigate('/my-profile'),
      },
      {
        title: "Passwort ändern",
        description: "Dein Passwort aktualisieren",
        icon: Key,
        onClick: () => navigate('/change-password'),
      },
    ];

    // Add Premium subscription only for Trans escorts
    if (user?.userType === 'trans') {
      baseSettings.push({
        title: "Premium Abo",
        description: "Premium werden für bessere Sichtbarkeit und mehr Matches",
        icon: Crown,
        onClick: () => navigate('/subscribe'),
        highlight: true,
      });
    }

    // Add common settings
    baseSettings.push(
      {
        title: "Benachrichtigungen",
        description: "Push-Benachrichtigungen verwalten",
        icon: Bell,
        onClick: () => {}, // TODO: Implement notifications settings
      },
      {
        title: "Privatsphäre & Sicherheit",
        description: "Deine Privatsphäre-Einstellungen",
        icon: Shield,
        onClick: () => {}, // TODO: Implement privacy settings
      },
      {
        title: "Hilfe & Support",
        description: "Häufige Fragen und Kontakt",
        icon: HelpCircle,
        onClick: () => {}, // TODO: Implement help page
      }
    );

    return baseSettings;
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
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Einstellungen</h1>
        
        {/* User Info Card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#FF007F] rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {user?.userType === 'trans' ? 'Trans Escort' : 'Kunde'}
                  {user?.isPremium && ' • Premium'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings List */}
        <div className="space-y-3 mb-6">
          {getSettingsItems().map((item, index) => (
            <Card key={index} className={item.highlight ? 'border-[#FF007F] bg-gradient-to-r from-[#FF007F]/5 to-transparent' : ''}>
              <CardContent className="p-0">
                <button
                  onClick={item.onClick}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={`w-5 h-5 ${item.highlight ? 'text-[#FF007F]' : 'text-muted-foreground'}`} />
                    <div>
                      <div className={`font-medium ${item.highlight ? 'text-[#FF007F]' : 'text-foreground'}`}>
                        {item.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Theme Toggle */}
        <Card className="mb-6">
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
      </div>
    </div>
  );
}