import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import type { User } from '@shared/schema';

export function useProfile() {
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();

  // Fetch fresh profile data
  const { data: profileData, isLoading, error, refetch } = useQuery<User>({
    queryKey: ['/api/auth/user'],
    enabled: !!authUser,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache data (replaces cacheTime in v5)
  });

  // Refresh profile data
  const refreshProfile = async () => {
    // Invalidate all user-related queries
    await queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    await queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    await queryClient.invalidateQueries({ queryKey: ['/api/users/public'] });
    
    // Refetch profile data
    return refetch();
  };

  return {
    profile: profileData || authUser,
    isLoading,
    error,
    refreshProfile,
  };
}