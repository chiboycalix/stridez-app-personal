"use client"

import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  ClipboardEvent,
  FormEvent,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Toastify from "@/components/Toastify";
import { baseUrl } from "@/utils/constant";
import { Button } from "@/components/ui/button";

type RefInputElement = HTMLInputElement | null;

const ResetPassword: React.FC = () => {
  const [codeDigits, setCodeDigits] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [alert, setAlert] = useState<string>("");
  const inputRefs = useRef<RefInputElement[]>([]);
  const router = useRouter();
  const queryParams = useSearchParams();
  const email = queryParams.get("email") || "";

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    const newCodeDigits = [...codeDigits];
    newCodeDigits[index] = value;
    setCodeDigits(newCodeDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newCodeDigits = [...codeDigits];
    for (let i = 0; i < pastedData.length; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newCodeDigits[i] = pastedData[i];
      }
    }
    setCodeDigits(newCodeDigits);
    if (pastedData.length === 6) {
      inputRefs.current[5]?.focus();
    } else {
      inputRefs.current[pastedData.length]?.focus();
    }
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
          triggerEvent: "confirm-reset-password",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setAlert(data.message);
        router.push(`/auth/password-update/?otp=${data.data.token}`);
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
          triggerEvent: "reset-creation",
        }),
      });
      const data = await response.json();
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
    <div className="flex-1 max-w-md mx-auto w-full">
      <Toastify message={alert} />
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="font-bold text-2xl"> Enter Verification Code</h1>
        </div>
        <div>

          <form onSubmit={handleSubmit}>
            <div onPaste={handlePaste} className="text-center">
              {codeDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  required
                  className="w-[3em] h-[3em] text-center input-no-spinner border rounded-lg border-black mx-2 my-4"
                />
              ))}
            </div>
            <Button
              type="submit"
              className="w-full"
            >
              Submit
            </Button>
            <p
              className="text-primary underline py-4 hover:cursor-pointer text-center"
              onClick={(e) => handleResendOtp(e)}
            >
              Resend a new code
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
