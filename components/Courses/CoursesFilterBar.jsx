import React, { useState } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon, FolderIcon, PlusIcon, TrashIcon } from "lucide-react";
import CreateNewFolderModal from "./CreateNewFolderModal";

export default function CoursesFilterBar({
  onDelete,
  selectedCourses,
  existingFolders,
  onSearch,
  searchQuery,
  onMove,
}) {
  const [moveFolder, setMoveFolder] = useState("");
  const [folderName, setFolderName] = useState("");
  const [showModal, setShowModal] = useState(false); // Control modal visibility

  const handleMoveChange = (folderId) => {
    setMoveFolder(folderId);
  };

  const handleCreateFolder = (newFolderName) => {
    setFolderName(newFolderName);
    onMove(newFolderName); // Pass the created folder name to `onMove`
    setMoveFolder(""); // Reset state after creation
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <h1 className="text-xl font-semibold text-gray-900 lg:block hidden">
          Course Management
        </h1>

        <div className="w-full sm:w-auto justify-center flex gap-3 items-center">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full px-3 py-2.5 border sm:w-[18rem] border-gray-100 bg-white text-sm rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />

          <div className="flex space-x-2">
            <Menu as="div" className="relative inline-block text-left">
              <MenuButton
                disabled={selectedCourses.length === 0}
                value={moveFolder}
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                onChange={(e) => handleMoveChange(e.target.value)}
              >
                {moveFolder ? existingFolders.find(folder => folder.id === moveFolder)?.title : 'Move to Folder'}
                <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
              </MenuButton>
              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <MenuItems className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {existingFolders.map((folder) => (
                      <MenuItem key={folder.id}>
                        {({ active }) => (
                          <button
                            onClick={() => handleMoveChange(folder.id)}
                            className={`${active ? "bg-gray-100 text-gray-900" : "text-gray-700"} group flex items-center px-4 py-2.5 text-sm w-full`}
                          >
                            <FolderIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                            {folder.title}
                          </button>
                        )}
                      </MenuItem>
                    ))}
                    {/* <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => setShowModal(true)} // Open modal
                          className={`${active ? "bg-gray-100 text-gray-900" : "text-gray-700"} group flex items-center px-4 py-2.5 text-sm w-full`}
                        >
                          <PlusIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                          Create New Folder
                        </button>
                      )}
                    </MenuItem> */}
                  </div>
                </MenuItems>
              </Transition>
            </Menu>

            <button
              onClick={onDelete}
              disabled={selectedCourses.length === 0}
              className="inline-flex items-center px-3 p-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TrashIcon className="xl:-ml-1 xl:mr-2 h-5 w-5" aria-hidden="true" />
              <span className="xl:block hidden">Delete Selected</span>
            </button>

            <button
              disabled={selectedCourses.length === 0 || (!moveFolder && folderName === "")}
              onClick={() => onMove(moveFolder === "new" ? folderName : moveFolder)}
              className="inline-flex items-center px-3 p-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Move Selected
            </button>
          </div>
        </div>
      </div>

      <CreateNewFolderModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleCreate={handleCreateFolder}
      />
    </div>
  );
}

