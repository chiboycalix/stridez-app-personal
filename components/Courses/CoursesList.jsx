import { DocumentIcon } from "@heroicons/react/24/outline";
import { FolderIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export default function CoursesList({
  courses,
  selectedCourses,
  setSelectedCourses,
  viewMode,
}) {
  const handleCourseSelect = (id) => {
    setSelectedCourses((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((courseId) => courseId !== id)
        : [...prevSelected, id]
    );
  };

  const renderGridView = () => (
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {courses.map((course) => (
        <li key={course.id} className="relative">
          <Link to={`/courses/${course.id}`}>
            <div
              className={`group aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 ${selectedCourses.includes(course.id)
                ? "ring-2 ring-indigo-500"
                : ""
                }`}
            >
              {course.type === "folder" ? (
                <FolderIcon className="h-full w-full text-yellow-400" />
              ) : (
                <img
                  src={course.thumbnailUrl || "https://via.placeholder.com/150"}
                  alt=""
                  className="pointer-events-none object-cover group-hover:opacity-75"
                />
              )}
              <button
                type="button"
                className="absolute inset-0 focus:outline-none"
                onClick={() => handleCourseSelect(course.id)}
              >
                <span className="sr-only">Select {course.title}</span>
              </button>
            </div>
            <div className="mt-2 flex items-start justify-between">
              <p className="block text-sm font-medium text-gray-900 truncate">
                {course.title}
              </p>

            </div>
          </Link>
          <input
            type="checkbox"
            checked={selectedCourses.includes(course.id)}
            onChange={() => handleCourseSelect(course.id)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
        </li>
      ))}
    </ul>
  );

  const renderListView = () => (
    <ul className="divide-y divide-gray-200">
      {courses.map((course) => (
        <li key={course.id} className="py-4 flex items-center">
          <input
            type="checkbox"
            checked={selectedCourses.includes(course.id)}
            onChange={() => handleCourseSelect(course.id)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-4"
          />
          <Link to={`/courses/${course.id}`}>
            {course.type === "folder" ? (

              <FolderIcon className="h-10 w-10 text-yellow-400 mr-4" />
            ) : (
              <DocumentIcon className="h-10 w-10 text-blue-400 mr-4" />
            )}
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{course.title}</p>
              <p className="text-sm text-gray-500">{course.description}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="overflow-hidden">
      {courses.length === 0 ? (
        <p className="text-center py-6 text-gray-500">No courses found.</p>
      ) : viewMode === "grid" ? (
        renderGridView()
      ) : (
        renderListView()
      )}
    </div>
  );
}
