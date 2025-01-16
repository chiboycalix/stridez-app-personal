'use client';

import React, { useState } from "react";
import { BsPencil } from "react-icons/bs";
import { BiShare } from "react-icons/bi";
import EditUserInputModal from "./EditUserInputModal";
import FollowButton from "@/components/ui/FollowButton";
import FollowLink from "./FollowLink";
import Image from "next/image";

interface Profile {
  firstName: string;
  lastName: string;
  avatar: string;
  bio: string;
}

interface UserProfile {
  id: number;
  username: string;
  profile?: Profile;
  followers: number;
  following: number;
}

interface ProfileHeaderProps {
  userProfile: UserProfile;
  isCurrentUser: boolean;
  onFollow: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userProfile,
  isCurrentUser,
  // onFollow,
}: any) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center">
        <Image
          width={96}
          height={96}
          className="w-24 h-24 rounded-full bg-gray-400 object-cover"
          src={
            userProfile?.profile?.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              userProfile?.username
            )}&background=random`
          }
          alt={`${userProfile?.username || "User"}'s profile avatar`}
        />
        <div className="ml-4">
          <h1 className="text-2xl font-semibold">
            {userProfile?.profile?.firstName &&
            userProfile?.profile?.lastName === "None"
              ? userProfile?.username
              : `${userProfile?.profile?.firstName || ""} ${
                  userProfile?.profile?.lastName || ""
                }`.trim()}
          </h1>
          <p className="text-sm">@{userProfile?.username}</p>
          <div className="flex gap-2 mt-2">
            {isCurrentUser ? (
              <button
                onClick={() => setShowModal(true)}
                aria-label="Edit your profile"
                className="flex items-center rounded-md py-1.5 px-3.5 text-[15px] font-medium border hover:bg-gray-100"
              >
                <BsPencil className="mr-1" />
                Edit
              </button>
            ) : (
              <FollowButton followedId={Number(userProfile?.id)} />
            )}
            <button
              className="flex items-center rounded-md py-1.5 px-3.5 text-[15px] font-medium border hover:bg-gray-100"
              aria-label="Share this profile"
            >
              <BiShare className="mr-1" />
              Share
            </button>
          </div>
        </div>
      </div>
      <div className="flex space-x-4 mt-3">
        <div>
          <span className="font-bold">{userProfile?.following}</span>
          <FollowLink
            id={userProfile?.id}
            type="followings"
            className="text-gray-500 text-sm"
            aria-label={`${userProfile?.following} people this user is following`}
          >
            {" "}
            Following
          </FollowLink>
        </div>
        <div>
          <span className="font-bold">{userProfile?.followers}</span>
          <FollowLink
            id={userProfile?.id}
            type="followers"
            className="text-gray-500 text-sm"
            aria-label={`${userProfile?.followers} followers`}
          >
            {" "}
            Followers
          </FollowLink>
        </div>
      </div>

      {/* Modal for editing user information */}
      {showModal && (
        <EditUserInputModal
          userProfile={userProfile}
          onClose={() => setShowModal(false)}
          aria-label="Edit user profile modal"
        />
      )}
    </div>
  );
};

export default ProfileHeader;
