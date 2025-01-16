import React, { useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function CreateNewFolderModal({
  show,
  handleClose,
  handleCreate,
}) {
  const [folderName, setFolderName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreate(folderName);
    setFolderName("");
    handleClose();
  };

  return (
    <Transition show={show} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-800/50 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-3 pt-2 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-8">
                <div className="absolute right-0 top-0 hidden pr-2 pt-2 sm:block">
                  <button
                    type="button"
                    className="rounded-full bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={handleClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="">
                  {/* <DialogTitle
                    as="h3"
                    className="text-lg sm:text-xl font-semibold leading-6 text-gray-900"
                  >
                    Create a New Folder
                  </DialogTitle> */}
                  <div className="mt-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label
                          htmlFor="folderName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Folder Name
                        </label>
                        <input
                          type="text"
                          id="folderName"
                          name="folderName"
                          value={folderName}
                          onChange={(e) => setFolderName(e.target.value)}
                          required
                          className="mt-1 px-2 block w-full rounded bg-transparent border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter folder name"
                        />
                      </div>
                      <div className="flex items-end justify-end">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out sm:mt-0 sm:w-auto sm:text-sm"
                          onClick={handleClose}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary/85 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Create
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
