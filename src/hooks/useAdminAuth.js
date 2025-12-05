import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';

/**
 * Custom hook to protect admin routes
 * PROPERLY waits for user data before redirecting
 */
export function useAdminAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, _hasHydrated, getCurrentUser } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Wait for store hydration
      if (!_hasHydrated) {
        return;
      }

      // If store is loading, wait
      if (isLoading) {
        return;
      }

      // If authenticated but no user data, fetch it
      if (isAuthenticated && !user) {
        try {
          await getCurrentUser();
        } catch (error) {
          console.error('Failed to get user:', error);
          router.replace('/login?redirect=/admin');
          setIsChecking(false);
          return;
        }
      }

      // Now we have complete data, check role
      if (!isAuthenticated) {
        router.replace('/login?redirect=/admin');
        setIsChecking(false);
        return;
      }

      if (user) {
        if (user.role !== 'admin') {
          router.replace('/dashboard');
          setIsChecking(false);
          return;
        }
        // User is admin, allow rendering
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, isLoading, user, _hasHydrated, router, getCurrentUser]);

  const canRender = !isLoading && !isChecking && isAuthenticated && user && user.role === 'admin';

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || isChecking,
    isAdmin: user?.role === 'admin',
    canRender
  };
}

