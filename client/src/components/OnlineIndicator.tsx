import React from 'react';
import { Badge } from '@/components/ui/badge';

interface OnlineIndicatorProps {
  isOnline: boolean;
  lastSeen?: string | Date;
  variant?: 'dot' | 'badge' | 'text';
  className?: string;
}

export function OnlineIndicator({ 
  isOnline, 
  lastSeen, 
  variant = 'dot', 
  className = '' 
}: OnlineIndicatorProps) {
  const formatLastSeen = (lastSeen: string | Date) => {
    if (!lastSeen) return '';
    
    const date = typeof lastSeen === 'string' ? new Date(lastSeen) : lastSeen;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMinutes < 1) return 'gerade online';
    if (diffMinutes < 60) return `vor ${diffMinutes} Min.`;
    if (diffHours < 24) return `vor ${diffHours} Std.`;
    if (diffDays < 7) return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;
    return 'länger offline';
  };

  if (variant === 'dot') {
    return (
      <div className={`relative ${className}`}>
        {isOnline && (
          <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
        )}
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <Badge 
        variant={isOnline ? 'default' : 'secondary'} 
        className={`${isOnline ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400'} ${className}`}
      >
        {isOnline ? 'Online' : 'Offline'}
      </Badge>
    );
  }

  if (variant === 'text') {
    return (
      <span className={`text-sm ${isOnline ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} ${className}`}>
        {isOnline ? 'Online' : formatLastSeen(lastSeen || new Date())}
      </span>
    );
  }

  return null;
}