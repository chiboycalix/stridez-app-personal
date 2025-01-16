"use client"

import React, {
  useState,
  useRef,
  ChangeEvent,
  KeyboardEvent,
  ClipboardEvent,
  FormEvent,
} from "react";
import Toastify from "@/components/Toastify";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { baseUrl } from "@/utils/constant";
import { Button } from "@/components/ui/button";

type RefInputElement = HTMLInputElement | null;

type ResponseData = {
  message: string;
  data?: {
    token: string;
  };
};

export default function Success() {
  const [codeDigits, setCodeDigits] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [alert, setAlert] = useState<string>("");
  const { setAuth } = useAuth();
  const router = useRouter();
  const inputRefs = useRef<RefInputElement[]>([]);

  const queryParams = useSearchParams();
  const email = queryParams.get("email") || "";

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (/^\d?$/.test(value)) {
      const newCodeDigits = [...codeDigits];
      newCodeDigits[index] = value;
      setCodeDigits(newCodeDigits);

      // Move to the next input field if not the last and there's a value
      if (value && index < codeDigits.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && codeDigits[index] === "") {
      // Move to the previous input if backspace is pressed and input is empty
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newCodeDigits = [...codeDigits];

    pastedData.split("").forEach((char, index) => {
      if (index < newCodeDigits.length) {
        newCodeDigits[index] = char;
      }
    });

    setCodeDigits(newCodeDigits);
    inputRefs.current[pastedData.length - 1]?.focus();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const verificationCode = codeDigits.join("");

    try {
      const response = await fetch(`${baseUrl}/auth/validate-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: verificationCode,
          triggerEvent: "account-creation",
        }),
      });

      const data: ResponseData = await response.json();
      console.log(data.message);

      if (response.ok) {
        setAlert(data.message);
        setAuth(true, data.data);
        router.push(`/welcome?email=${email}`);
      } else {
        setAlert(data.message);
      }
    } catch (error) {
      setAlert(String(error));
    }
  };

  const handleResendOtp = async (e: React.MouseEvent<HTMLParagraphElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          triggerEvent: "account-creation",
        }),
      });

      const data: ResponseData = await response.json();
      if (response.ok) {
        setAlert(data.message);
      } else {
        setAlert(data.message);
      }
    } catch (error) {
      setAlert(String(error));
    }
  };

  return (
    <div className="flex-1 max-w-lg mx-auto w-full">
      <Toastify message={alert} />

      <div className="w-full bg-white">

        <div className="w-full">
          <p className="font-bold text-2xl text-center">Hey, {email} </p>
          <p className="text-center"> An Otp has been sent to your email, please enter the 6
            digits below</p>
          <div className="w-full">
            <form
              onSubmit={handleSubmit}
              className="w-full"
              onPaste={handlePaste}
            >
              <div className="my-10 text-center">
                {codeDigits.map((digit, index) => (
                  <input
                    key={index}
                    type="number"
                    min="0"
                    max="9"
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    required
                    className="w-[3em] h-[3em] text-center input-no-spinner border rounded-lg border-black mx-2"
                  />
                ))}
              </div>
              <Button
                type="submit"
                className="bg-primary px-2 w-full"
              >
                Confirm
              </Button>

              <p
                className="text-primary text-center underline py-4 hover:cursor-pointer"
                onClick={(e) => handleResendOtp(e)}
              >
                Resend a new code
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
