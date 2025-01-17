import React, { useState, useEffect } from 'react';
import ProfileCompletionAlert from './ProfileCompletionAlert';
import { useAuth } from '@/context/AuthContext';

const ProfileCompletionManager = () => {
  const { currentUser } = useAuth();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (currentUser && !currentUser.profileSetupCompleted) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [currentUser]);

  const handleDismiss = () => {
    setShowAlert(false);
  };

  if (!currentUser) return null;

  return (
    <>
      {
        showAlert && <ProfileCompletionAlert
          isProfileComplete={currentUser.profileSetupCompleted}
          currentUser={currentUser}
          onDismiss={handleDismiss}
        />
      }
    </>
  );
};

export default ProfileCompletionManager;