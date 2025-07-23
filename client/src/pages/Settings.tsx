import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  User, Key, Bell, EyeOff, UserX, Shield, Crown, 
  HelpCircle, Mail, LogOut, ChevronRight 
} from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <h2 className="text-xl font-bold mb-4">Einstellungen</h2>
      
      <div className="space-y-4">
        {/* Account Settings */}
        <Card>
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">Account</h3>
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              <button className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span>Profil bearbeiten</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              
              <button className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Key className="w-5 h-5 text-muted-foreground" />
                  <span>Passwort ändern</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <span>Benachrichtigungen</span>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">Erscheinungsbild</h3>
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 text-muted-foreground">🌙</div>
                <span>Dark Mode</span>
              </div>
              <Switch 
                checked={theme === 'dark'} 
                onCheckedChange={toggleTheme}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Safety */}
        <Card>
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">Privatsphäre & Sicherheit</h3>
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              <button className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                  <span>Privatsphäre-Einstellungen</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              
              <button className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <UserX className="w-5 h-5 text-muted-foreground" />
                  <span>Blockierte Nutzer</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              
              <button className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <span>Sicherheitscenter</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Premium */}
        {user?.isPremium ? (
          <Card className="bg-gradient-to-r from-[#FF007F]/10 to-purple-500/10 border-[#FF007F]/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Crown className="w-6 h-6 text-[#FF007F]" />
                  <div>
                    <h3 className="font-semibold">Premium Mitgliedschaft</h3>
                    <p className="text-sm text-muted-foreground">Aktiv</p>
                  </div>
                </div>
                <Button size="sm" className="bg-[#FF007F] hover:bg-[#FF007F]/90">
                  Verwalten
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-r from-[#FF007F]/10 to-purple-500/10 border-[#FF007F]/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Crown className="w-6 h-6 text-[#FF007F]" />
                  <div>
                    <h3 className="font-semibold">Premium werden</h3>
                    <p className="text-sm text-muted-foreground">Erweiterte Funktionen freischalten</p>
                  </div>
                </div>
                <Button size="sm" className="bg-[#FF007F] hover:bg-[#FF007F]/90">
                  Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Support */}
        <Card>
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">Support</h3>
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              <button className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <HelpCircle className="w-5 h-5 text-muted-foreground" />
                  <span>Hilfe & FAQ</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              
              <button className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <span>Kontakt</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              
              <button 
                onClick={handleLogout}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors text-red-500"
              >
                <div className="flex items-center space-x-3">
                  <LogOut className="w-5 h-5" />
                  <span>Abmelden</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
