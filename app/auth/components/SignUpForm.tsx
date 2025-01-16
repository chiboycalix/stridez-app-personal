'use client';
import Toastify from '@/components/Toastify';
import Spinner from '@/components/Spinner';
import SocialButtons from '@/components/SocialButtons';
import Input from '@/components/ui/Input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockIcon, Mail } from 'lucide-react';
import { Checkbox } from '@/components/ui/Checkbox';
import { AUTH_API } from '@/lib/api';
import { ROUTES } from '@/constants/routes';

export default function SignUpForm({
  passwordVisible,
  togglePasswordVisibility,
  rememberPassword,
  toggleRememberPassword,
}: any) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      setAlert("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setAlert("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const data = await AUTH_API.signUp({
        email,
        password
      }) as any;
      if (data.code === 200) {
        setAlert(data.message);
        setLoading(false);
        router.push(`${ROUTES.VALIDATE_OTP(email)}`);
      } else {
        setAlert(data.message);
      }
    } catch (error) {
      setAlert(`Error: ${error}`);
    } finally {
      setLoading(false);
      setLoading(false);
    }
  };

  const OrSeparator = () => (
    <div className="flex items-center gap-x-4 w-full mx-auto px-1.5 text-sm text-gray-400">
      <div className="h-[0.1rem] w-full bg-gray-300" />
      <div>OR</div>
      <div className="h-[0.1rem] w-full bg-gray-300" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <SocialButtons />
        <OrSeparator />
      </div>


      <Toastify message={alert} />
      <form
        className="mx-auto mb-0 mt-3 max-w-md space-y-3"
        onSubmit={handleSubmit}
      >
        <Input
          leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
          label="Email"
          variant="text"
          id="email"
          name="email"
          placeholder="johndoe@strides.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
        />
        <Input
          icon={<LockIcon className="h-5 w-5 text-gray-400" />}
          label="Password"
          variant="password"
          placeholder="*****"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div>
          <Input
            icon={<LockIcon className="h-5 w-5 text-gray-400" />}
            label="Confirm Password"
            variant="password"
            placeholder="*****"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            id="confirmPassword"
            name="confirmPassword"
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div
            className="text-sm flex items-center gap-2"
          >
            <Checkbox />
            <span>Remember Password</span>
          </div>
          <div
            onClick={() => router.push("/auth/forgot-password")}
            className="text-primary text-sm hover:cursor-pointer font-semibold"
          >
            Forgot password?
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#37169c] h-[50px] border-0 p-2.5 text-sm cursor-pointer rounded-lg text-white w-full font-medium leading-6"
        >
          {loading ? (
            <Spinner className={""} />
          ) : (
            "Create an account with Stridez"
          )}
        </button>

        <div className="text-center text-sm">
          By creating an account, you agree to our{' '}
          <a href="#" className="font-semibold">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="font-semibold">
            {' '}
            Privacy & Cookie Statement.
          </a>
        </div>
      </form>
    </div>
  );
}
