import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../Providers/AuthProvider";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  FolderIcon,
  GridIcon,
  ListIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import Cookies from "js-cookie";

const CoursesPage = () => {
  const { id } = useParams();
  const courseId = parseInt(id);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [existingFolders, setExistingFolders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFolderMenu, setShowFolderMenu] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const baseUrl = process.env.REACT_APP_BASEURL;
  const { getCurrentUser } = useAuth();
  const userId = getCurrentUser()?.id;

  const [viewMode, setViewMode] = useState(() => {
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
      const folders =
        data?.data?.courses?.map((course) => ({
          id: course.id,
          title: course.title,
        })) || [];
      setExistingFolders(folders);
    } catch (err) {
      console.log("Error fetching folders:", err);
    }
  }, [baseUrl, userId]);

  const fetchSingleCourses = useCallback(async () => {
    try {
      const res = await fetch(
        `${baseUrl}/users/${userId}/courses/${id}/details?page=1&&limit=10`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const data = await res.json();
      const coursesData = data?.data?.courses.media || [];
      console.log("coursesData", coursesData);
      setCourses(coursesData);
      setFilteredCourses(coursesData);
    } catch (err) {
      console.log("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, userId, id]);

  const handleDeleteCourses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/courses/manage`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        body: JSON.stringify({
          event: "DELETE",
          resourceType: "COURSEITEM",
          resourceId: courseId,
          resource: selectedCourses,
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
  }, [baseUrl, courses, selectedCourses, courseId]);

  const handleMoveCourses = useCallback(
    async (folder) => {
      console.log(folder);
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
            resourceId: courseId,
            resource: selectedCourses,
            destinationFolder: parseInt(folder),
          }),
        });
        if (res.ok) {
          await fetchSingleCourses();
          setSelectedCourses([]);
          setShowFolderMenu(false);
        }
      } catch (error) {
        console.log("Error moving courses:", error);
      } finally {
        setLoading(false);
      }
    },
    [baseUrl, selectedCourses, fetchSingleCourses, courseId]
  );

  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query);
      const filtered = courses.filter((course) =>
        course.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCourses(filtered);
    },
    [courses]
  );

  useEffect(() => {
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
    fetchSingleCourses();
    fetchFolderList();
  }, [fetchSingleCourses, fetchFolderList]);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("courseViewMode", mode);
  };

  return (
    <div className="min-h-[85vh] bg-white rounded-md py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className=" flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Back to Courses
          </button>
        </div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"></div>

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
                className={`p-2 rounded-md ${
                  viewMode === "grid"
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                aria-label="Grid view"
              >
                <GridIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleViewModeChange("list")}
                className={`p-2 rounded-md ${
                  viewMode === "list"
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
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6"
                : "space-y-4"
            }
          >
            {filteredCourses.map((course) => (
              <Link
                to={`/course/${id}`}
                key={course.id}
                className={`${
                  viewMode === "grid"
                    ? "rounded-lg  overflow-hidden"
                    : "rounded-lg items-start  relative flex gap-4"
                } ${
                  selectedCourses.includes(course.id)
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
              >
                {viewMode === "grid" ? (
                  <>
                    <div className="aspect-video relative">
                      {course.type === "folder" ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                          <FolderIcon className="h-16 w-16 text-gray-400" />
                        </div>
                      ) : (
                        <video
                          src={course.url}
                          poster={course.thumbnail}
                          paused
                          muted
                          className="w-full bg-gray-200 h-full rounded-lg object-cover"
                        />
                      )}
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
                    <div className="p-4">
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
                    <div className="absolute z-20 top-2 left-2">
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(course.id)}
                        onClick={(e) => e.stopPropagation()}
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
                    {course.type === "folder" ? (
                      <FolderIcon className="h-10 w-10 text-gray-400" />
                    ) : (
                      <video
                        src={course.url}
                        poster={course.thumbnail}
                        paused
                        loop
                        muted
                        className="bg-gray-200 xl:w-[24rem] lg:w-[20rem] md:w-[18rem] sm:w-[16rem] w-[10rem] h-full rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0 py-6">
                      <h3 className="font-medium text-gray-900 truncate">
                        {course.title}
                      </h3>
                      {!course.type && (
                        <p className="text-sm text-gray-500 truncate">
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
};
export default CoursesPage;
