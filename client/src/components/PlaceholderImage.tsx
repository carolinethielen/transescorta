import React from 'react';
import { User } from 'lucide-react';

interface PlaceholderImageProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  userType?: 'trans' | 'man';
  showIcon?: boolean;
}

export function PlaceholderImage({ 
  className = '', 
  size = 'md',
  userType = 'trans',
  showIcon = true 
}: PlaceholderImageProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16', 
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-6 h-6',
    lg: 'w-8 h-8', 
    xl: 'w-12 h-12'
  };

  // Different gradient colors for trans vs customers
  const gradientClass = userType === 'trans' 
    ? 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 dark:from-pink-800 dark:via-purple-800 dark:to-blue-800'
    : 'bg-gradient-to-br from-blue-200 via-gray-200 to-slate-200 dark:from-blue-800 dark:via-gray-800 dark:to-slate-800';

  return (
    <div className={`${sizeClasses[size]} ${gradientClass} rounded-full flex items-center justify-center ${className}`}>
      {showIcon && (
        <User className={`${iconSizes[size]} text-white opacity-80`} />
      )}
    </div>
  );
}

// Default placeholder SVG for trans users
export const TransPlaceholderSVG = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-full h-full"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="transGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF007F" />
        <stop offset="50%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#transGradient)" />
    <circle cx="50" cy="35" r="12" fill="white" opacity="0.9" />
    <path
      d="M30 70 Q30 55 50 55 Q70 55 70 70 L70 85 Q70 90 65 90 L35 90 Q30 90 30 85 Z"
      fill="white"
      opacity="0.9"
    />
  </svg>
);

// Default placeholder for customers
export const CustomerPlaceholderSVG = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-full h-full"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="customerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="50%" stopColor="#6B7280" />
        <stop offset="100%" stopColor="#1F2937" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#customerGradient)" />
    <circle cx="50" cy="35" r="12" fill="white" opacity="0.9" />
    <path
      d="M25 75 Q25 60 50 60 Q75 60 75 75 L75 90 Q75 95 70 95 L30 95 Q25 95 25 90 Z"
      fill="white"
      opacity="0.9"
    />
  </svg>
);