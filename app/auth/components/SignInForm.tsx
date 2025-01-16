"use client";
import SocialButtons from "@/components/SocialButtons";
import Input from "@/components/ui/Input";
import Spinner from "@/components/Spinner";
import Cookies from "js-cookie";
import Toastify from "@/components/Toastify";
import { useState } from "react";
import { LockIcon, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/Checkbox";
import { COOKIE_OPTIONS, useAuth } from "@/context/AuthContext";
import { AUTH_API } from "@/lib/api/";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";

export default function SignInForm({
  passwordVisible,
  togglePasswordVisibility,
  rememberPassword,
  toggleRememberPassword,
}: any) {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    try {
      const data = (await AUTH_API.signIn({
        email: email,
        password: password,
      })) as any;
      if (data.code === 200) {
        Cookies.set("accessToken", data.data.token, COOKIE_OPTIONS);
        setAuth(true, data.data, data.data.token);
        setAlert("Login Successful");
        if (!data.data.profileSetupCompleted) {
          router.push(`${ROUTES.PROFILE(data?.data?.id)}`);
          return;
        }
        router.push(ROUTES.HOME);
      } else {
        setAlert(
          String(data.data.message) ||
          "Invalid email or password. Please try again."
        );
        setLoading(false);
      }
    } catch (error) {
      setAlert("An error occurred while signing in. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const OrSeparator = () => (
    <div className="flex items-center gap-x-4 w-full mx-auto px-1.5 text-sm text-gray-400">
      <div className="h-[0.1rem] w-full bg-gray-300" />
      <div>OR</div>
      <div className="h-[0.1rem] w-full bg-gray-300" />
    </div>
  );

  return (
    <div className="space-y-6">
      <Toastify message={alert} />
      <div className="">
        <SocialButtons />
        <OrSeparator />
      </div>

      <form
        className="mx-auto mb-0 mt-1 w-full space-y-3"
        onSubmit={handleSubmit}
      >
        <Input
          icon={<Mail className="h-5 w-5 text-gray-400" />}
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
          id="password"
          name="password"
          placeholder="*****"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex items-center justify-between">
          <div className="text-sm flex items-center gap-2">
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
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Spinner /> : "Sign In with Stridez"}
        </Button>
      </form>
    </div>
  );
}
