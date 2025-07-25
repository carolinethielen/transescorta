import React from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { BottomNavigation } from '@/components/BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  // Don't show bottom navigation on certain pages
  const hideBottomNav = [
    '/landing',
    '/login',
    '/register',
    '/user-type-selection',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/terms',
    '/privacy',
    '/legal',
  ].includes(location);

  return (
    <div className="min-h-screen bg-background">
      <main className={hideBottomNav ? '' : 'pb-20'}>
        {children}
      </main>
      
      {!hideBottomNav && <BottomNavigation />}
    </div>
  );
}