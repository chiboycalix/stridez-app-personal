"use client";

import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
import Socket from "@/components/Socket";
import { useAuth } from "@/context/AuthContext";
import { BsX } from "react-icons/bs";
import Toastify from "@/components/Toastify";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { baseUrl, cloudinaryCloudName } from "@/utils/constant";
import Image from "next/image";
import Cookies from "js-cookie";
import { ROUTES } from "@/constants/routes";

const ProfileSetup = () => {
  const { getAuth, getCurrentUser, setAuth } = useAuth();
  const router = useRouter();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [username, setUsername] = useState<string>("");
  const [alert, setAlert] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);





  // useEffect(() => {
  //   const user = getCurrentUser();
  //   if (!getAuth()) router.push("/auth");
  //   // if (user?.profileSetupCompleted) router.push("/");
  // }, [getAuth, getCurrentUser, router]);

  return (
    <>
      <Toastify message={alert} />
      
      <div className="flex flex-col lg:flex-row max-h-screen p-3 lg:gap-20 bg-white rounded-lg">
        {/* Profile Setup Header */}
        <div className="w-full lg:w-5/12 relative">
          <Image
            width={800}
            height={256}
            src={"assets/profilepix.png"}
            alt="Profile Setup"
            className="w-full h-64 lg:h-full object-cover rounded-lg"
          />
          <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black to-transparent rounded-b-lg">
            <h2 className="text-white text-3xl font-medium">
              Set up your profile
            </h2>
          </div>
        </div>

        {/* Profile Setup Form */}
        <div
          className="w-full px-4 lg:px-16 flex-1 flex justify-center rounded-lg overflow-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="max-w-[40rem] py-3">
            <h2 className="text-3xl font-semibold my-4">Set up your profile</h2>

           

            {/* Skip Info */}
            <p className="w-full text-gray-500 text-xs mt-2 text-center lg:text-left mb-6">
              You can skip this process now and complete your profile setup
              later in the profile settings.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileSetup;
