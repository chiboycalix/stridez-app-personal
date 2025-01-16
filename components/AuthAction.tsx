'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface AuthActionProps {
  children: React.ReactNode;
  onUnauthenticated?: () => void;
}

export default function AuthAction({ children, onUnauthenticated }: AuthActionProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      e.stopPropagation();

      if (onUnauthenticated) {
        onUnauthenticated();
      } else {
        router.push('/auth?tab=signin');
      }
    }
  };

  return (
    <div onClick={handleClick}>
      {children}
    </div>
  );
}