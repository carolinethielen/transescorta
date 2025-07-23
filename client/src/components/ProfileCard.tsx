import React from 'react';
import { MapPin, Crown } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  profileImageUrl?: string;
  location?: string;
  interests?: string[];
  isPremium?: boolean;
  isOnline?: boolean;
}

interface ProfileCardProps {
  user: User;
  onClick?: (user: User) => void;
}

export function ProfileCard({ user, onClick }: ProfileCardProps) {
  const displayName = user.firstName || 'Anonymer Nutzer';
  const displayAge = user.age ? `, ${user.age}` : '';
  
  return (
    <Card 
      className={`relative overflow-hidden cursor-pointer hover:scale-105 transition-transform ${
        user.isPremium ? 'ring-2 ring-[#FF007F]/30 shadow-lg shadow-[#FF007F]/10' : ''
      }`}
      onClick={() => onClick?.(user)}
    >
      {user.isPremium && (
        <div className="absolute top-2 left-2 bg-[#FF007F] text-white px-2 py-1 rounded-full text-xs font-bold z-10">
          <Crown className="w-3 h-3 inline mr-1" />
          Premium
        </div>
      )}
      
      {user.isOnline && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white z-10" />
      )}
      
      <div className="aspect-[3/4] bg-muted">
        {user.profileImageUrl ? (
          <img 
            src={user.profileImageUrl} 
            alt={displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <User className="w-16 h-16" />
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-lg truncate">
          {displayName}{displayAge}
        </h3>
        
        {user.location && (
          <p className="text-sm text-muted-foreground flex items-center mt-1">
            <MapPin className="w-3 h-3 mr-1" />
            {user.location}
          </p>
        )}
        
        {user.interests && user.interests.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {user.interests.slice(0, 3).map((interest, index) => (
              <span 
                key={index}
                className="bg-[#FF007F]/20 text-[#FF007F] px-2 py-1 rounded-full text-xs"
              >
                {interest}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
