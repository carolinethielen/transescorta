import React from 'react';
import { useLocation } from 'wouter';
import { Home, MessageCircle, User, Search, Settings } from 'lucide-react';
import { Link } from 'wouter';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/chat', icon: MessageCircle, label: 'Chat' },
  { path: '/profile', icon: User, label: 'Profil' },
  { path: '/explore', icon: Search, label: 'Entdecken' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function BottomNavigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-md w-full bg-card border-t border-border z-50">
      <div className="flex justify-around py-3">
        {navItems.map(({ path, icon: Icon, label }) => {
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
    </nav>
  );
}
