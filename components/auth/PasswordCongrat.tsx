import React from "react";
import { useRouter, useSearchParams } from "next/navigation.js";
import { Button } from "../ui/button";

const PasswordCongrat = () => {
  const router = useRouter();
  const queryParams = useSearchParams();
  const email = queryParams.get("email");

  const handleExplore = () => {
    router.push("/");
  };

  return (
    <div>
      <div className="h-screen flex">
        <div className="flex-1 flex flex-col justify-center items-center gap-y-4 border mx-[20rem] bg-white">
          <div className="h-20 w-20">
            <img src={"/assets/Congrats.png"} alt="congrats" />
          </div>

          <div className="gap-y-4">
            <p className="font-bold text-2xl py-4">Hey, {email} </p>
            <p className="py-4">
              Successful! Your new password has been successfully updated
            </p>

            <div onClick={() => handleExplore()}>
              <Button
                type="submit"
                className="bg-purple-900 px-2"
              >Back to sign in</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordCongrat;
