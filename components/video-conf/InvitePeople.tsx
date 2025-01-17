import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Input from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { baseUrl } from "@/utils/constant";
import { useVideoConferencing } from "@/context/VideoConferencingContext";
import Cookies from "js-cookie";

type User = {
  id: string;
  username: string;
  email: string;
};

const InvitePeopleTab = () => {
  const { getCurrentUser } = useAuth();

  const [followings, setFollowings] = useState<User[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [externalEmailUsers, setExternalEmailUsers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("following");
  const roomId = useVideoConferencing()?.channelName;

  const userId = getCurrentUser()?.id;

  console.log("roomId", roomId);

  // Fetch Data for Followers and Followings
  const fetchFollowings = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/users/${userId}/followings?page=1&limit=20`
      );
      console.log(response);
      setFollowings(response?.data?.data?.followings);
    } catch (error) {
      console.error("Error fetching followings:", error);
    }
  };

  const fetchFollowers = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/users/${userId}/followers?page=1&limit=20`
      );
      console.log(response);
      setFollowers(response?.data?.data?.followers);
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  const sendInvites = async () => {
    try {
      const token = Cookies.get("accessToken"); // Get token from cookies
      const response = await fetch(`${baseUrl}/rooms/invite-participant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          externalParticipant: externalEmailUsers,
          internalParticipant: selectedUsers.map((user) => user.email),
          roomCode: roomId,
        }),
      });
      console.log(response);
      if (response.status === 200) {
        alert("Invites sent successfully");
        setSelectedUsers([]);
        setExternalEmailUsers([]);
      }
    } catch (error) {
      console.error("Error sending invites:", error);
    }
  };

  // Handle tab changes
  useEffect(() => {
    if (activeTab === "following") {
      fetchFollowings();
    } else if (activeTab === "followers") {
      fetchFollowers();
    }
  }, [activeTab, userId]);

  const handleUserToggle = (user: User) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((u) => u.id === user.id);
      if (isSelected) {
        return prev.filter((u) => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  const removeUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  return (
    <Tabs
      defaultValue="following"
      className="w-full"
      onValueChange={(value) => setActiveTab(value)}
    >
      <TabsList className="grid w-full grid-cols-3 bg-white">
        <TabsTrigger
          value="following"
          className="bg-white rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary-900"
        >
          Following
        </TabsTrigger>
        <TabsTrigger
          value="followers"
          className="bg-white rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary-900"
        >
          Followers
        </TabsTrigger>
        <TabsTrigger
          value="email"
          className="bg-white rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary-900"
        >
          Email
        </TabsTrigger>
      </TabsList>

      {/* Following Tab */}
      <TabsContent value="following">
        {/* Selected Users Badges */}
        {selectedUsers?.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {selectedUsers?.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-1 bg-primary-100 text-primary-900 px-2 py-1 rounded-full text-sm"
              >
                <span>{user.username}</span>
                <button
                  onClick={() => removeUser(user.id)}
                  className="hover:bg-primary-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="space-y-4">
          <Input
            variant="search"
            placeholder="Search"
            className="border bg-transparent"
          />
          {followings &&
            followings.length > 0 &&
            followings?.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Checkbox
                  checked={selectedUsers?.some((u) => u.id === user.id)}
                  onCheckedChange={() => handleUserToggle(user)}
                  className="h-5 w-5"
                />
              </div>
            ))}
        </div>
      </TabsContent>

      {/* Followers Tab */}
      <TabsContent value="followers">
        <div className="space-y-4">
          <Input
            variant="search"
            placeholder="Search"
            className="border bg-transparent"
          />
          {followers &&
            followers?.length > 0 &&
            followers?.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Checkbox
                  checked={selectedUsers?.some((u) => u.id === user.id)}
                  onCheckedChange={() => handleUserToggle(user)}
                  className="h-5 w-5"
                />
              </div>
            ))}
        </div>
      </TabsContent>

      {/* Email Tab */}
      <TabsContent value="email">
        <Input
          variant="text"
          placeholder="Enter Email"
          className="border bg-transparent"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const email = e.currentTarget.value;
              if (email) {
                setExternalEmailUsers((prev) => [...prev, email]);
                e.currentTarget.value = "";
              }
            }
          }}
        />
        {externalEmailUsers?.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {externalEmailUsers?.map((email, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-primary-100 text-primary-900 px-2 py-1 rounded-full text-sm"
              >
                <span>{email}</span>
                <button
                  onClick={() =>
                    setExternalEmailUsers((prev) =>
                      prev.filter((e) => e !== email)
                    )
                  }
                  className="hover:bg-primary-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </TabsContent>
      {/* Send Invite Button */}
      {(selectedUsers?.length > 0 || externalEmailUsers?.length > 0) && (
        <div className="mt-6">
          <Button
            className="w-full bg-primary-900 text-white hover:bg-primary-800"
            onClick={() => sendInvites().then}
          >
            Send Invite ({selectedUsers?.length + externalEmailUsers?.length})
          </Button>
        </div>
      )}
    </Tabs>
  );
};

export default InvitePeopleTab;
