import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/AuthModal';
import { Home, MessageCircle, User, Search, Settings, LogIn, UserPlus, ImageIcon } from 'lucide-react';
import { Link } from 'wouter';

const getNavItems = (userType?: string) => {
  if (userType === 'trans') {
    // Trans Escort Navigation
    return [
      { path: '/', icon: Home, label: 'Home' },
      { path: '/chat', icon: MessageCircle, label: 'Chat' },
      { path: '/my-profile', icon: User, label: 'Profil' },
      { path: '/albums', icon: ImageIcon, label: 'Alben' },
      { path: '/settings', icon: Settings, label: 'Mehr' },
    ];
  } else {
    // Customer Navigation (no albums, no premium subscription needed)
    return [
      { path: '/', icon: Home, label: 'Home' },
      { path: '/chat', icon: MessageCircle, label: 'Chat' },
      { path: '/my-profile', icon: User, label: 'Profil' },
      { path: '/settings', icon: Settings, label: 'Mehr' },
    ];
  }
};

export function BottomNavigation() {
  const [location, navigate] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  const handleLogin = () => {
    setAuthTab('login');
    setShowAuthModal(true);
  };

  const handleRegister = () => {
    setAuthTab('register');
    setShowAuthModal(true);
  };

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-md w-full bg-card border-t border-border z-50">
      {isAuthenticated && !isLoading ? (
        // Authenticated Navigation
        <div className="flex justify-around py-3">
          {getNavItems(user?.userType || undefined).map(({ path, icon: Icon, label }) => {
            const isActive = location === path;
            return (
              <Link
                key={path}
                href={path}
                className={`flex flex-col items-center space-y-1 px-3 py-1 transition-colors ${
                  isActive 
                    ? 'text-[#FF007F]' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      ) : !isLoading ? (
        // Unauthenticated Navigation - Login/Register buttons
        <div className="flex gap-3 py-3 px-4">
          <Button
            onClick={handleLogin}
            variant="outline"
            size="lg"
            className="flex-1 border-[#FF007F] text-[#FF007F] hover:bg-[#FF007F] hover:text-white transition-colors"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Einloggen
          </Button>
          <Button
            onClick={handleRegister}
            size="lg"
            className="flex-1 bg-[#FF007F] hover:bg-[#FF007F]/90 text-white transition-colors"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Registrieren
          </Button>
        </div>
      ) : null}
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authTab}
      />
    </nav>
  );
}