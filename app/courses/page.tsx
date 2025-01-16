"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  ChevronDownIcon,
  FolderIcon,
  GridIcon,
  ListIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import { FaSpinner } from "react-icons/fa";
import { baseUrl } from "@/utils/constant";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type Course = {
  id: string;
  title: string;
  description?: string;
  type?: string;
};

type Folder = {
  id: string;
  title: string;
};

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [existingFolders, setExistingFolders] = useState<Folder[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showFolderMenu, setShowFolderMenu] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const { getCurrentUser, isAuthenticated } = useAuth();
  const userId = getCurrentUser()?.id;
  const router = useRouter()


  const [viewMode, setViewMode] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("courseViewMode") || "grid";
    }
    return "grid";
  });

  const fetchFolderList = useCallback(async () => {
    try {
      const res = await fetch(
        `${baseUrl}/users/${userId}/courses/?page=1&limit=50`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      const data = await res.json();
      const folders: Folder[] =
        data?.data?.courses?.map((course: Course) => ({
          id: course.id,
          title: course.title,
        })) || [];
      setExistingFolders(folders);
    } catch (err) {
      console.log("Error fetching folders:", err);
    }
  }, [userId]);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch(`${baseUrl}/users/${userId}/courses`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      const data = await res.json();
      const coursesData: Course[] = data?.data?.courses || [];
      setCourses(coursesData);
      setFilteredCourses(coursesData);
    } catch (err) {
      console.log("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const handleDeleteCourses = useCallback(async () => {
    try {
      setLoading(true);
      const deleteRequest =
        selectedCourses.length === 1 ? selectedCourses[0] : null;
      const res = await fetch(`${baseUrl}/courses/manage`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        body: JSON.stringify({
          event: "DELETE",
          resourceType: "COURSE",
          resourceId: deleteRequest,
          resource: selectedCourses.filter((id) => id !== deleteRequest),
        }),
      });
      if (res.ok) {
        const remainingCourses = courses.filter(
          (course) => !selectedCourses.includes(course.id)
        );
        setCourses(remainingCourses);
        setFilteredCourses(remainingCourses);
        setSelectedCourses([]);
        setShowDelete(true);
        setTimeout(() => setShowDelete(false), 3000);
      } else {
        console.log("Failed to delete course");
      }
    } catch (error) {
      console.log("Error occurred while deleting course:", error);
    } finally {
      setLoading(false);
    }
  }, [courses, selectedCourses]);

  const handleMoveCourses = useCallback(
    async (folderId: string) => {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/courses/manage`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          body: JSON.stringify({
            event: "MOVE",
            resourceType: "COURSEITEM",
            resourceId: folderId,
            resource: selectedCourses,
            destinationFolder: parseInt(folderId),
          }),
        });
        if (res.ok) {
          await fetchCourses();
          setSelectedCourses([]);
          setShowFolderMenu(false);
        }
      } catch (error) {
        console.log("Error moving courses:", error);
      } finally {
        setLoading(false);
      }
    },
    [selectedCourses, fetchCourses]
  );

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      const filtered = courses.filter((course) =>
        course.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCourses(filtered);
    },
    [courses]
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        setFilteredCourses(courses);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, handleSearch, courses]);

  useEffect(() => {
    fetchCourses();
    fetchFolderList();
  }, [fetchCourses, fetchFolderList]);

  const handleViewModeChange = (mode: string) => {
    setViewMode(mode);
    localStorage.setItem("courseViewMode", mode);
  };

  return (
    <div className="min-h-[85vh] bg-white rounded-md py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Course Management
          </h1>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-1/2 -mt-2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleViewModeChange("grid")}
                className={`p-2 rounded-md ${viewMode === "grid"
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                  }`}
                aria-label="Grid view"
              >
                <GridIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleViewModeChange("list")}
                className={`p-2 rounded-md ${viewMode === "list"
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                  }`}
                aria-label="List view"
              >
                <ListIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFolderMenu(!showFolderMenu)}
                disabled={selectedCourses.length === 0}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Move to Folder
                <ChevronDownIcon className="inline-block ml-2 -mr-1 h-5 w-5" />
              </button>
              {showFolderMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    {existingFolders.map((folder) => (
                      <button
                        key={folder.id}
                        onClick={() => handleMoveCourses(folder.id)}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <FolderIcon className="mr-3 h-5 w-5 text-gray-400" />
                        {folder.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleDeleteCourses}
              disabled={selectedCourses.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TrashIcon className="inline-block -ml-1 mr-2 h-5 w-5" />
              Delete
            </button>
          </div>
        </div>

        {showDelete && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
            Courses deleted successfully
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-72">
            <div className="flex flex-col items-center space-y-2">
              <FaSpinner className="animate-spin text-primary text-4xl" />
              <p className="text-gray-500">Loading...</p>
            </div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No courses found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery
                ? "Try adjusting your search"
                : "Get started by creating a new course"}
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredCourses.map((course) => (
              <Link
                href={`/courses/${course.id}`}
                key={course.id}
                className={`$ { bg-white border
                  viewMode === "grid"
                    ? "rounded-lg overflow-hidden"
                    : "rounded-lg items-start relative flex gap-3 p-2"
                } $ {
                  selectedCourses.includes(course.id)
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
              >
                {viewMode === "grid" ? (
                  <>
                    <div className="aspect-video relative">
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <FolderIcon className="h-16 w-16 text-gray-400" />
                      </div>
                      <div className="absolute top-2 left-2">
                        <input
                          type="checkbox"
                          onClick={(e) => e.stopPropagation()}
                          checked={selectedCourses.includes(course.id)}
                          onChange={() => {
                            setSelectedCourses((prev) =>
                              prev.includes(course.id)
                                ? prev.filter((id) => id !== course.id)
                                : [...prev, course.id]
                            );
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 truncate">
                        {course.title}
                      </h3>
                      {!course.type && (
                        <p className="mt-1 text-sm text-gray-500 truncate">
                          {course.description}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <input
                      type="checkbox"
                      onClick={(e) => e.stopPropagation()}
                      checked={selectedCourses.includes(course.id)}
                      onChange={() => {
                        setSelectedCourses((prev) =>
                          prev.includes(course.id)
                            ? prev.filter((id) => id !== course.id)
                            : [...prev, course.id]
                        );
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className=" inset-0 flex items-center justify-center bg-gray-100 p-1 rounded-md">
                      <FolderIcon className="h-16 w-16 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 truncate">
                        {course.title}
                      </h3>
                      {!course.type && (
                        <p className="mt-1 text-sm text-gray-500 truncate">
                          {course.description}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
