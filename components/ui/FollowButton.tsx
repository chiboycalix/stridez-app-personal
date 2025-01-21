import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ROUTES } from "@/constants/routes";

type FollowButtonProp = {
  followedId: number | string;
};

const FollowButton = ({ followedId }: FollowButtonProp) => {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASEURL;
  const { getAuth } = useAuth();
  const router = useRouter();

  // Fetch follow status on page load
  const checkFollowStatus = useCallback(async () => {
    try {
      const response = await fetch(
        `${baseUrl}/users/${followedId}/follows/status`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      const data = await response.json();
      const followStatus = data?.data?.followed || false;
      setIsFollowing(followStatus);
    } catch (error) {
      console.log("Error checking follow status:", error);
      setIsFollowing(false);
    }
  }, [followedId, baseUrl]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    getAuth() && checkFollowStatus(); //could pose a loop problem

    //could pose a loop problem
  }, [checkFollowStatus, getAuth]);

  // Follow the user
  const handleFollow = async () => {
    if (!getAuth()) return router.push("/auth");
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/users/follows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        body: JSON.stringify({ userId: followedId }),
      });

      if (!response.ok) throw new Error("Failed to follow the user");

      setIsFollowing(true);
    } catch (error) {
      console.log("Error following user:", error);
    } finally {
      setLoading(false);
    }
  };

  // Unfollow the user
  const handleUnfollow = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/users/${followedId}/unfollow`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to unfollow the user");

      setIsFollowing(false);
    } catch (error) {
      console.log("Error unfollowing user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={isFollowing ? handleUnfollow : handleFollow}
      disabled={loading || isFollowing === null}
      aria-label={
        loading
          ? "Processing your request"
          : isFollowing === null
          ? "Loading follow status"
          : isFollowing
          ? "Unfollow this user"
          : "Follow this user"
      }
      aria-pressed={isFollowing ?? undefined} // Fixed here
      className={`bg-[#37169C] text-white px-4 py-2.5 text-sm rounded hover:bg-purple-700 ${
        isFollowing ? "Following" : "Follow"
      }`}
    >
      {loading
        ? "Loading..."
        : isFollowing === null
        ? "Follow"
        : isFollowing
        ? "Unfollow"
        : "Follow"}
    </button>
  );
};

export default FollowButton;
