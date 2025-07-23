import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { type User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // Handle user type update from localStorage after login
  useEffect(() => {
    const handleUserTypeUpdate = async () => {
      if (user && user.id) {
        const pendingUserType = localStorage.getItem('pendingUserType');
        if (pendingUserType && ['trans', 'man'].includes(pendingUserType)) {
          try {
            await fetch('/api/users/update-type', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ userType: pendingUserType })
            });
            localStorage.removeItem('pendingUserType');
            // Refresh user data
            window.location.reload();
          } catch (error) {
            console.error('Failed to update user type:', error);
          }
        }
      }
    };

    handleUserTypeUpdate();
  }, [user]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
