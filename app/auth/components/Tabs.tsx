'use client';
import { useRouter, usePathname } from 'next/navigation';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { Button } from '@/components/ui/button';

interface TabsProps {
  tab: string;
}

export function Tabs({ tab }: TabsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (newTab: string) => {
    router.push(`${pathname}?tab=${newTab}`);
  };

  return (
    <div className="flex-1 max-w-md mx-auto w-full">
      <div className='mb-2'>
        <Button className={`w-full bg-primary`} onClick={() => router.push('/')}>
          Explore
        </Button>
      </div>
      <div className="flex w-full bg-primary-50 p-1 rounded-xl gap-2">
        <Button className={`w-full text-[#454545] ${tab === 'signin' ? "bg-primary-200 font-bold hover:bg-primary-300" : "bg-transparent hover:bg-primary-200"}`} onClick={() => handleTabChange('signin')}>
          Sign In
        </Button>

        <Button className={`w-full text-[#454545] ${tab === 'signup' ? "bg-primary-200 font-bold hover:bg-primary-300" : "bg-transparent hover:bg-primary-200"}`} onClick={() => handleTabChange('signup')}>
          Create an Account
        </Button>
      </div>

      {tab === 'signin' && <SignInForm />}
      {tab === 'signup' && <SignUpForm />}
    </div>
  );
}
