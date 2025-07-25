import React from 'react';
import { MapPin, Crown, User as UserIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { type User } from '@shared/schema';

interface ProfileCardProps {
  user: User;
  onClick?: (user: User) => void;
}

export function ProfileCard({ user, onClick }: ProfileCardProps) {
  const displayName = user.firstName || 'Anonymer Nutzer';
  const displayAge = user.age ? `, ${user.age}` : '';
  
  return (
    <Card 
      className={`relative overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg ${
        user.isPremium ? 'ring-2 ring-[#FF007F]/30 shadow-lg shadow-[#FF007F]/10' : ''
      }`}
      onClick={() => onClick?.(user)}
    >
      {user.isPremium && (
        <div className="absolute top-2 left-2 bg-gradient-to-r from-[#FF007F] to-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold z-10 shadow-md">
          <Crown className="w-3 h-3 inline mr-1" />
          Premium
        </div>
      )}
      
      {/* Always show online indicator - all users are considered online */}
      <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white z-10 shadow-sm" />
      
      <div className="aspect-[3/4] bg-muted relative overflow-hidden">
        {user.profileImageUrl ? (
          <img 
            src={user.profileImageUrl} 
            alt={displayName}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-muted/50">
            <UserIcon className="w-12 h-12 md:w-16 md:h-16" />
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-3 md:p-4">
        <h3 className="font-semibold text-sm md:text-lg truncate">
          {displayName}{displayAge}
        </h3>
        
        {user.location && (
          <p className="text-xs md:text-sm text-muted-foreground flex items-center mt-1">
            <MapPin className="w-3 h-3 mr-1" />
            {user.location}
          </p>
        )}
        
        {user.interests && user.interests.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {user.interests.slice(0, 2).map((interest, index) => (
              <span 
                key={index}
                className="bg-[#FF007F]/20 text-[#FF007F] px-2 py-1 rounded-full text-xs font-medium"
              >
                {interest}
              </span>
            ))}
            {user.interests.length > 2 && (
              <span className="text-xs text-muted-foreground">
                +{user.interests.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
