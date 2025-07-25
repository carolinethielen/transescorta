import React from 'react';
import { BottomNavigation } from './BottomNavigation';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="w-full bg-background min-h-screen relative">
      {/* Mobile Layout (up to 768px) */}
      <div className="md:hidden max-w-md mx-auto min-h-screen relative">
        <main className="pb-20">
          {children}
        </main>
        <BottomNavigation />
      </div>
      
      {/* Desktop/Tablet Layout (768px and up) */}
      <div className="hidden md:flex min-h-screen">
        {/* Sidebar Navigation */}
        <aside className="w-64 lg:w-80 bg-card border-r border-border flex-shrink-0">
          <BottomNavigation />
        </aside>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
