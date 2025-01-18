"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProfileHeader from "./_components/ProfileHeader";
import ProfileTabs from "./_components/ProfileTabs";
import { baseUrl } from "@/utils/constant";
import Cookies from "js-cookie";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { Course, MyLearning, Post, UserProfile } from "@/types/courses";

const Profile: React.FC = () => {
  const { id } = useParams();
  const { getAuth, currentUser } = useAuth();
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [myLearning, setMyLearning] = useState<MyLearning[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 0,
    username: "",
    followers: 0,
    following: 0,
  });

  // console.log("id", id);
  let userId = 0;
  if (id && typeof id === "string") {
    userId = parseInt(id, userId);
  }

  const isCurrentUser = currentUser?.id === userId;

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/profiles/${id}`);

      if (response.status === 404) {
        router.push("/404");
        return;
      }

      const profileData = await response.json();
      setUserProfile(profileData?.data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching user profile:", error);
      setError(true);
    }
  }, [id, router]);

  const fetchData = useCallback(
    async <T,>(
      endpoint: string,
      setter: React.Dispatch<React.SetStateAction<T[] | null>>
    ) => {
      try {
        const response = await fetch(`${baseUrl}/users/${id}/${endpoint}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        });
        const data = await response.json();
        if (endpoint === "courses") {
          setter(data?.data?.courses);
        } else if (endpoint === "posts") {
          setter(data?.data?.posts);
        }
      } catch (error) {
        console.log(`Error fetching ${endpoint}:`, error);
      }
    },
    [id]
  );

  useEffect(() => {
    const initiator = async () => {
      await fetchUserProfile();
      await fetchData<Course>("courses", setCourses);
      await fetchData<Post>("posts?page=1&limit=10", setPosts);
      if (isCurrentUser) {
        fetchData<MyLearning>("learnings?page=1&limit=10", setMyLearning);
      }
    };
    initiator();
  }, [fetchUserProfile, fetchData, isCurrentUser, id]);

  const handleFollow = () => {
    if (!getAuth()) {
      router.push("/auth");
      return;
    }
    console.log("Follow action");
  };

  // Uncomment and use these blocks for loading and error states if needed
  if (error)
    return (
      <div className="bg-white rounded">
        <Error
          errorCode={500}
          errorMessage="Something went wrong while loading this profile. Please refresh."
        />
      </div>
    );

  if (loading)
    return (
      <div className="bg-white rounded">
        <Loading />
      </div>
    );

  return (
    <div className="w-full flex flex-col bg-white my-px min-h-[83vh] p-3">
      <ProfileHeader
        userProfile={userProfile}
        isCurrentUser={isCurrentUser}
        onFollow={handleFollow} // Pass handleFollow function to ProfileHeader
      />
      <ProfileTabs
        isCurrentUser={isCurrentUser}
        courses={courses}
        posts={posts}
        myLearning={myLearning}
        user={currentUser}
        loadingCourses={false}
        loadingPosts={false}
      />
    </div>
  );
};

export default Profile;
