import React, { useState, useRef } from 'react';
import { MapPin, Crown } from 'lucide-react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

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

interface SwipeCardProps {
  user: User;
  onSwipe: (userId: string, direction: 'left' | 'right') => void;
}

export function SwipeCard({ user, onSwipe }: SwipeCardProps) {
  const [exitX, setExitX] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-30, 30]);
  const opacity = useTransform(x, [-150, -100, 0, 100, 150], [0, 1, 1, 1, 0]);

  const displayName = user.firstName || 'Anonymer Nutzer';
  const displayAge = user.age ? `, ${user.age}` : '';

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      setExitX(200);
      onSwipe(user.id, 'right');
    } else if (info.offset.x < -100) {
      setExitX(-200);
      onSwipe(user.id, 'left');
    }
  };

  return (
    <motion.div
      className="absolute inset-0 bg-card rounded-2xl overflow-hidden shadow-2xl cursor-grab"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={exitX ? { x: exitX } : {}}
      whileDrag={{ cursor: 'grabbing' }}
    >
      <div className="relative w-full h-full">
        {user.profileImageUrl ? (
          <img 
            src={user.profileImageUrl} 
            alt={displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <div className="text-muted-foreground text-6xl">👤</div>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">
              {displayName}{displayAge}
            </h2>
            {user.isPremium && (
              <div className="bg-[#FF007F] px-3 py-1 rounded-full text-xs font-bold flex items-center">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </div>
            )}
          </div>
          
          {user.location && (
            <p className="text-sm opacity-90 flex items-center mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              {user.location} • {user.isOnline ? 'Online' : 'Offline'}
            </p>
          )}
          
          {user.interests && user.interests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {user.interests.slice(0, 4).map((interest, index) => (
                <span 
                  key={index}
                  className="bg-white/20 px-3 py-1 rounded-full text-xs"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
