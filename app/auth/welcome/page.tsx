'use client';

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function WelcomeContent() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const email = queryParams.get("email") || "";
  const { getCurrentUser, isAuthenticated } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSetupProfile = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push(`${ROUTES.SETUP_PROFILE}`);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.SIGN_IN);
    }
  }, [getCurrentUser, isAuthenticated, router]);


  if (!mounted) {
    return null
  }

  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="h-24 w-24">
        <img src={"/assets/Congrats.png"} alt="congrats" />
      </div>

      <div className="flex flex-col justify-center items-center gap-3 text-pretty ">
        <p className="font-bold text-xl mb-1">Hey, {email} </p>
        <p className="w-1/2 text-center text-sm">
          Congratulations! Your account has been successfully verified. Let us
          personalize the app for your use case to enhance your experience.
        </p>

        <div>
          <Button
            onClick={(e)=>handleSetupProfile(e)}
            type="button"
            className="bg-purple-900 rounded-lg text-white hover:bg-opacity-90 text-xs py-3 px-6 cursor-pointer"
          >
            Set up your profile
          </Button>
        </div>
      </div>
    </div>
  )
}