"use client";

import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/Spinner";
import Toastify from "@/components/Toastify";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/utils/constant";

const interestsList = [
  "Product design",
  "Baking",
  "Knitting",
  "Painting",
  "Animation",
  "UI/UX",
  "Video editing",
  "Miro",
  "Html",
  "Marketing",
  "Phonics",
  "AI",
  "Figma",
];

const SelectInterests = () => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<string>("");

  const router = useRouter();
  const { getCurrentUser, setAuth } = useAuth();

  const toggleTopic = (topic: any) => {
    setSelectedInterests((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const user = getCurrentUser();

  const handleSkip = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/");
  };

  const filteredTopics = interestsList?.filter((interest) =>
    interest?.toLowerCase().includes(search?.toLowerCase())
  );

  // Use useEffect to observe state changes in selectedInterests
  useEffect(() => {
    console.log("Selected Topics updated:", selectedInterests);
  }, [selectedInterests]); // Runs every time selectedInterests changes

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    const requestPayload = {
      firstName: user?.firstName,
      lastName: user?.lastName,
      bio: user?.bio,
      username: user?.username,
      avatar: user?.avatar,
      interest: selectedInterests,
    };

    try {
      const response = await fetch(`${baseUrl}/profiles`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        body: JSON.stringify(requestPayload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      setAlert(data.message);
    //   setAuth(true, data.data);

      router.push("/");
    } catch (error) {
      setAlert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toastify message={alert} />
      <div className="h-screen flex flex-col items-center w-full">
        <div className="max-w-lg w-full px-8 py-24">
          <h2 className="text-2xl font-semibold mb-3">Almost done!</h2>
          <p className="mb-3 text-gray-600">
            Select topics of your interest to personalize your experience.
          </p>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topics"
            className="mb-1 w-full text-sm px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-blue-500"
          />

          <div className="flex flex-wrap justify-center gap-2 my-8">
            {filteredTopics &&
              filteredTopics?.map((topic) => (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`px-4 py-2 rounded-full shadow-sm text-sm ${
                    selectedInterests?.includes(topic)
                      ? "bg-[#37169C] text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {topic}
                </button>
              ))}
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-[#37169C] text-white py-2.5 text-sm rounded-xl hover:bg-[#37169C]/85 transition-all"
          >
            {loading ? <Spinner className="text-white" /> : "Save and Continue"}
          </button>

          <button
            onClick={handleSkip}
            className="w-full mt-3 py-2.5 text-sm bg-transparent border border-gray-200 hover:bg-gray-200 text-gray-600 rounded-md"
          >
            Skip for now
          </button>

          <p className="mt-4 text-center text-gray-600 text-sm">
            You can skip this for now and set up your profile later in the
            settings.
          </p>
        </div>
      </div>
    </>
  );
};

export default SelectInterests;
