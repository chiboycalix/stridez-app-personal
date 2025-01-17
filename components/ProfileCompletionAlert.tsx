import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserCog, X } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

const ProfileCompletionAlert = ({
  isProfileComplete = false,
  currentUser = '',
  onDismiss
}: any) => {
  if (isProfileComplete) {
    return null;
  }

  return (
    <Alert className="rounded-none border-l-4 border-l-yellow-500 relative">
      <UserCog className="h-5 w-5 text-yellow-500" />
      <AlertTitle className="text-yellow-500">Complete Your Profile Setup</AlertTitle>
      <AlertDescription className="text-sm text-gray-600">
        Welcome {currentUser?.profile?.username}! Please complete your profile setup to access all features.
        <Link
          href={ROUTES.PROFILE(currentUser?.id)}
          className="ml-2 text-blue-600 hover:text-blue-800 hover:underline"
        >
          Complete Setup →
        </Link>
      </AlertDescription>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </Alert>
  );
};

export default ProfileCompletionAlert;