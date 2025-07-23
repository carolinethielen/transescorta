import React from 'react';
import { BottomNavigation } from './BottomNavigation';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen relative">
      <main className={isAuthenticated ? "pb-20" : ""}>
        {children}
      </main>
      {isAuthenticated && <BottomNavigation />}
    </div>
  );
}
