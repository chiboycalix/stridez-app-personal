"use client";

import React, { useEffect } from "react";
import SplashScreen from "@/components//SplashScreen";
import { useAuth } from "@/context/AuthContext";
import { BsX } from "react-icons/bs";
import { useRouter, useSearchParams } from "next/navigation";

export default function Welcome() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const email = queryParams.get("email");
  const { getCurrentUser, isAuthenticated } = useAuth();
  console.log("getCurrentUser.....", getCurrentUser);

  const handleExplore = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const user = getCurrentUser();

    // if (!user.profileSetupCompleted) {
    //   router.push(`/auth/setup-profile`);
    // } else {
    //   router.push(`/`);
    // }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/auth?tab=signin`);
    }
  }, [getCurrentUser, isAuthenticated, router]);

  return (
    <div className="grid relative grid-cols-1 xl:grid-cols-5 h-screen w-full bg-white">
      <SplashScreen />
      <button
        onClick={() => router.push("/")}
        className="fixed top-7 right-7 p-1.5 bg-slate-100 rounded-full"
      >
        <BsX className="text-xl" />
      </button>

      {/* Content on the right side */}
      <div className="flex-1 xl:col-span-3 flex flex-col my-20 px-10  justify-center items-center gap-y-4">
        <div className="h-24 w-24">
          <img src={"/assets/Congrats.png"} alt="congrats" />
        </div>

        {/* Main content with greeting and button */}
        <div className="flex flex-col justify-center items-center gap-3 text-pretty ">
          <p className="font-bold text-xl mb-1">Hey, {email} </p>
          <p className="w-1/2 text-center text-sm">
            Congratulations! Your account has been successfully verified. Let us
            personalize the app for your use case to enhance your experience.
          </p>

          {/* Button to set up profile or explore the app */}
          <div onClick={(e) => handleExplore(e)}>
            <button
              type="button"
              className="bg-purple-900 rounded-lg text-white hover:bg-opacity-90 text-xs py-3 px-6"
            >
              Set up your profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
