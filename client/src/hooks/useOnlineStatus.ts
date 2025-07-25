import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';

export function useOnlineStatus() {
  const { user, isAuthenticated } = useAuth();
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isVisibleRef = useRef(true);

  const updateOnlineStatus = async (isOnline: boolean) => {
    if (!isAuthenticated || !user) return;
    
    try {
      await apiRequest(`/api/auth/online-status`, {
        method: 'POST',
        body: JSON.stringify({ isOnline }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(`Online status updated to: ${isOnline}`);
    } catch (error) {
      console.error('Failed to update online status:', error);
    }
  };

  const handleVisibilityChange = () => {
    const isVisible = !document.hidden;
    isVisibleRef.current = isVisible;
    
    if (isAuthenticated && user) {
      updateOnlineStatus(isVisible);
    }
  };

  const handleBeforeUnload = () => {
    if (isAuthenticated && user) {
      // Use navigator.sendBeacon for reliable offline status update
      const data = JSON.stringify({ isOnline: false });
      navigator.sendBeacon('/api/auth/online-status', new Blob([data], { type: 'application/json' }));
    }
  };

  const startHeartbeat = () => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    heartbeatIntervalRef.current = setInterval(() => {
      if (isAuthenticated && user && isVisibleRef.current) {
        updateOnlineStatus(true);
      }
    }, 30000); // Every 30 seconds
  };

  const stopHeartbeat = () => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      stopHeartbeat();
      return;
    }

    // Set initial online status
    updateOnlineStatus(true);

    // Start heartbeat
    startHeartbeat();

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      stopHeartbeat();
      
      // Set offline when component unmounts
      if (isAuthenticated && user) {
        updateOnlineStatus(false);
      }
    };
  }, [isAuthenticated, user]);

  // Handle focus/blur events for additional reliability
  useEffect(() => {
    const handleFocus = () => {
      isVisibleRef.current = true;
      if (isAuthenticated && user) {
        updateOnlineStatus(true);
      }
    };

    const handleBlur = () => {
      isVisibleRef.current = false;
      if (isAuthenticated && user) {
        updateOnlineStatus(false);
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isAuthenticated, user]);
}