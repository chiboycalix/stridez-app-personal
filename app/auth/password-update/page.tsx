"use client";

import React, { useState } from "react";
import Toastify from "@/components/Toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { baseUrl } from "@/utils/constant";
import Input from "@/components/ui/Input";
import { LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const PasswordUpdate = () => {
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [alert, setAlert] = useState("");
  const queryParams = useSearchParams();
  const tempToken = queryParams.get("otp");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password1 !== password2) {
      setAlert("Passwords do not match.");
      return;
    }
    if (password1.length < 6) {
      setAlert("Passwords length must be atleast 6.");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/auth/confirm-reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password1,
          confirmPassword: password2,
          token: tempToken,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAlert(data.message);
        router.push(`/PasswordCongrat?email=${data.data.email}`);
        setTimeout(() => { }, 600);
      } else {
        setAlert(
          data.message || "Failed to update password. Please try again."
        );
      }
    } catch (error) {
      setAlert(String(error));
    }
  };

  return (
    <div className="flex-1 max-w-md mx-auto w-full">
      <Toastify message={alert} />
      <div className="w-full">
        <h2 className="font-bold text-3xl py-4 text-center">Update Password</h2>
        <div className="gap-y-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              leftIcon={<LockIcon className="h-5 w-5 text-gray-400" />}
              label="Password"
              variant="password"
              placeholder="*****"
              value={password1}
              id="password1"
              name="password1"
              onChange={(e) => setPassword1(e.target.value)}
            />

            <div>
              <Input
                leftIcon={<LockIcon className="h-5 w-5 text-gray-400" />}
                label="Confirm Password"
                variant="password"
                placeholder="*****"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                id="password2"
                name="password2"
              />
              {password2 && password1 !== password2 && (
                <p className="text-red-500 text-sm mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            <Button type="submit" className="bg-primary w-full px-2">
              Save Password
            </Button>
            <p className=" text-center py-4">
              This will be your new password to sign in to stridez
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordUpdate;
