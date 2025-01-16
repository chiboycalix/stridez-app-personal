import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

type ExploreAuthProps = { isSignIn: boolean | null; setIsSignIn: any };

const ExploreAuth = ({ isSignIn, setIsSignIn }: ExploreAuthProps) => {
  const router = useRouter();
  const { getAuth } = useAuth();

  useEffect(() => {
    if (getAuth()) return router.push("/");
  });

  return (
    <div className="flex flex-col w-full gap-2.5 mt-8 transition-all duration-300">
      <Button className={`w-full bg-primary`} onClick={() => router.push("/")}>
        Explore
      </Button>

      <div className="flex w-full bg-primary-50 p-1 rounded-xl gap-2">
        <Button
          className={`w-full text-[#454545] ${isSignIn
              ? "bg-primary-200 font-bold hover:bg-primary-300"
              : "bg-transparent hover:bg-primary-200"
            }`}
          onClick={() => setIsSignIn(true)}
        >
          Sign In
        </Button>
        <Button
          className={`w-full text-[#454545] ${!isSignIn
              ? "bg-primary-200 font-bold hover:bg-primary-300"
              : "bg-transparent hover:bg-primary-200"
            }`}
          onClick={() => setIsSignIn(false)}
        >
          Create an Account
        </Button>
      </div>
    </div>
  );
};

export default ExploreAuth;
