import React from "react";
import Link from "next/link";
import Image from "next/image";

interface ProfileErrorCodeProps {
  icon: string;
  username: string;
  errorMessage: string;
  buttonText: string;
  href: string;
}

const ProfileErrorCode: React.FC<ProfileErrorCodeProps> = ({
  icon,
  username,
  errorMessage,
  buttonText,
  href,
}) => {
  return (
    <div className="max-w-md mx-auto text-center">
      <div className="flex items-center flex-col space-y-3 mt-3">
        <Image
          width={160}
          height={100}
          src={icon}
          alt="icon"
          className="aspect-square w-40"
        />
        <div>
          <h3 className="text-lg font-semibold pb-px">Hey, {username}</h3>
          <p className="text-xs pt-px">{errorMessage}</p>
        </div>
      </div>
      <div className="mt-4 w-full">
        <Link
          href={href}
          className="bg-primary text-sm text-white px-16 py-2.5 w-full rounded-md hover:bg-primary/90 transition-colors"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

export default ProfileErrorCode;
