import React from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { EscortProfileView } from '@/components/EscortProfileView';
import { type User } from '@shared/schema';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function EscortProfile() {
  const [location, navigate] = useLocation();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  
  // Get user ID from URL params (either /profile/:userId or /profile?id=userId)
  const { userId } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const profileId = userId || urlParams.get('id');
  
  console.log('EscortProfile - profileId resolved:', profileId);

  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ['/api/users', profileId, 'public'],
    queryFn: () => fetch(`/api/users/${profileId}/public`).then(res => {
      if (!res.ok) throw new Error('Profile not found');
      return res.json();
    }),
    enabled: !!profileId,
  });

  const handleContactEscort = () => {
    if (!currentUser) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Du musst dich anmelden um Escorts zu kontaktieren",
        variant: "destructive",
      });
      setTimeout(() => {
        navigate("/select-type");
      }, 1000);
      return;
    }
    navigate(`/chat?user=${profileId}`);
    toast({
      title: "Chat wird geöffnet",
      description: `Du startest eine Unterhaltung mit ${user?.firstName || 'diesem Escort'}`,
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  if (isLoading) {
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
          <h2 className="text-xl font-semibold mb-2">Profil nicht gefunden</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Profile ID: {profileId || 'Keine ID gefunden'}
          </p>
          <button onClick={handleBack} className="px-4 py-2 bg-[#FF007F] text-white rounded-lg hover:bg-[#FF007F]/90">
            Zurück zur Startseite
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === user.id;

  return (
    <EscortProfileView
      user={user}
      isOwnProfile={isOwnProfile}
      onBack={handleBack}
      onContact={!isOwnProfile ? handleContactEscort : undefined}
      onEdit={isOwnProfile ? () => navigate('/profile-edit') : undefined}
    />
  );
}