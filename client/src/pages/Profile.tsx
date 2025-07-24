import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { type User, type Match } from '@shared/schema';
import { EscortProfileView } from '@/components/EscortProfileView';
import { useLocation } from 'wouter';

export default function Profile() {
  const { user, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  // Fetch user matches for stats
  const { data: matches = [] } = useQuery<(Match & { user: User })[]>({
    queryKey: ['/api/matches'],
    retry: false,
  });

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF007F] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Profil nicht verfügbar</h2>
          <Button onClick={() => navigate('/login')}>Anmelden</Button>
        </div>
      </div>
    );
  }

  return (
    <EscortProfileView
      user={user}
      isOwnProfile={true}
      onEdit={() => navigate('/profile/edit')}
    />
  );
}