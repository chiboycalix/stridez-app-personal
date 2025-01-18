import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FollowButton from "@/components/ui/FollowButton";
import Link from "next/link";
import Cookies from "js-cookie";

interface FollowModalProps {
  type: "followers" | "following";
}

interface User {
  userId: number;
  username: string;
  avatar?: string;
}

const FollowModal: React.FC<FollowModalProps> = ({ type }: any) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const router = useRouter();
  const id = params?.id as string; // Ensure `id` is typed correctly

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASEURL}/users/${id}/${type}?page=1&limit=10`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data?.data[type] || []);
      setFilteredUsers(data?.data[type] || []);
    } catch (error) {
      console.log(`Error fetching ${type}:`, error);
      setError(`Failed to load ${type}. Please try again later.`);
    } finally {
      setIsLoading(false);
    }
  }, [id, type]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleClose = () => {
    router.back();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex items-center justify-center"
        onClick={handleClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 500 }}
          className="bg-white rounded-xl w-full max-w-md mx-auto h-[30rem] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="text-md font-semibold text-gray-900">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-3">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-full text-red-500">
                  {error}
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex justify-center items-center h-full text-gray-500">
                  No users found
                </div>
              ) : (
                filteredUsers.map((user, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center space-x-4 py-2 px-3 border-b hover:bg-gray-100"
                  >
                    <img
                      src={
                        user.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.username
                        )}&background=random`
                      }
                      alt={`${user.username}'s avatar`}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                    />
                    <Link href={`/profile/${user.userId}`} className="flex-1">
                      <span className="text-gray-900 text-sm">
                        {user.username}
                      </span>
                    </Link>
                    <FollowButton followedId={user.userId} />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FollowModal;
