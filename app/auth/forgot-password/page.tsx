"use client";

import React, { useState } from "react";
import Toastify from "@/components/Toastify";
import { useRouter } from "next/navigation.js";
import { baseUrl } from "@/utils/constant";
import Input from "@/components/ui/Input";
import { Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${baseUrl}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          triggerEvent: "confirm-reset-password",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setAlert(data.message);
        router.push(`/auth/reset-password?email=${email}`);
      } else {
        setAlert(data.message);
      }
    } catch (error) {
      setAlert(`${error}`);
    }
  };

  return (
    <div className="flex-1 max-w-md mx-auto w-full">
      <Toastify message={alert} />
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="font-bold text-2xl">Forgot Password?</h1>
        </div>
        <p className="text-center">Enter your email address and we&apos;ll send you instructions to reset your password.</p>
        <div className="w-full">
          <form
            onSubmit={handleSubmit}
            className="mx-auto mb-0 mt-1 w-full space-y-3"
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

            <Button
              type="submit"
              className="bg-purple-900 px-2 mx-auto w-full"
            >
              Send OTP
            </Button>
          </form>

          <div className="text-center mt-8">
            <Link
              href="/auth?tab=signin"
              className="text-sm text-primary hover:text-primary-500 font-semibold"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div >
  );
}
