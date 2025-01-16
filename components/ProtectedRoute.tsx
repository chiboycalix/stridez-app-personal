'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireProfileSetup?: boolean;
  requireVerification?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireProfileSetup = false,
  requireVerification = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      router.push('/auth?tab=signin');
      return;
    }

    if (requireVerification && currentUser?.userVerified === false) {
      router.push('/verify-account');
      return;
    }
  }, [
    isAuthenticated,
    currentUser,
    requireAuth,
    requireProfileSetup,
    requireVerification,
    router,
  ]);

  if (
    (requireAuth && !isAuthenticated) ||
    (requireProfileSetup && currentUser?.
      profileSetupCompleted === false) ||
    (requireVerification && currentUser?.
      userVerified === false)
  ) {


    if (loading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      );
    }
    if (!isAuthenticated) {
      return null; // Or redirect
    }
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
}