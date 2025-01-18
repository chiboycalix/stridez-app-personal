"use client";

import React, { useState, useEffect } from "react";
import HeaderImage from "@/components/HeaderImage";
import ExploreAuth from "@/components/ExploreAuth";
import SocialButtons from "@/components/SocialButtons";
import SignInForm from "@/app/auth/components/SignInForm";
import SignUpForm from "@/app/auth/components/SignUpForm";
import { useRouter, useSearchParams } from "next/navigation";

export function AuthForm() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const tab = queryParams.get("tab");
  const [isSignIn, setIsSignIn] = useState<boolean | null>(null);

  const handleTabSwitch = (signIn: boolean) => {
    setIsSignIn(signIn);
    const newTab = signIn ? "signin" : "signup";
    router.push(`/auth?tab=${newTab}`);
  };

  const OrSeparator = () => (
    <div className="flex items-center gap-x-4 w-full mx-auto px-1.5 text-sm text-gray-400">
      <div className="h-[0.1rem] w-full bg-gray-300" />
      <div>OR</div>
      <div className="h-[0.1rem] w-full bg-gray-300" />
    </div>
  );

  useEffect(() => {
    setIsSignIn(tab !== "signup");
  }, [tab]);

  return (
    <div className="w-full flex-1">
      <div className="flex justify-center items-center flex-col">
        <HeaderImage src={"/assets/logo.png"} />
        <ExploreAuth
          isSignIn={isSignIn}
          setIsSignIn={() => handleTabSwitch(!isSignIn)}
        />
        <SocialButtons />
        <OrSeparator />
        <div className="flex flex-col items-center w-full">
          {isSignIn ? (
            <SignInForm
            />
          ) : (
            <SignUpForm />
          )}
        </div>
        <div className="all">
          By creating an account, you agree to our{" "}
          <a href="#" className="font-semibold">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="font-semibold">
            {" "}
            Privacy & Cookie Statement.
          </a>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
