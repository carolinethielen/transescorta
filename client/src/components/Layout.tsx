import React from 'react';
import { BottomNavigation } from './BottomNavigation';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="w-screen h-screen bg-background overflow-hidden">
      {/* Mobile Layout (up to 768px) */}
      <div className="md:hidden w-screen h-screen bg-background">
        <div className="w-full h-screen relative bg-background">
          <main className="pb-20 bg-background w-full">
            {children}
          </main>
          <BottomNavigation />
        </div>
      </div>
      
      {/* Desktop/Tablet Layout (768px and up) */}
      <div className="hidden md:flex h-screen w-screen bg-background">
        {/* Sidebar Navigation */}
        <aside className="w-64 lg:w-80 bg-background border-r border-border flex-shrink-0 h-full">
          <BottomNavigation />
        </aside>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-background h-full">
          <div className="w-full h-full p-6 bg-background">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
