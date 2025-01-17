"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import {
  Dialog,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { CalendarIcon, ClockIcon, PencilIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loading from "@/components/ui/Loading";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { baseUrl } from "@/utils/constant";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import MeetingHistory from "@/components/schedules/MeetingHistory";

type Room = {
  roomCode: string;
  roomSubscribers: any;
};

export interface Schedule {
  id: string;
  title: string;
  date: string;
  startTime: string;
  isOngoing: boolean;
  room: Room;
  description: string;
  endTime: string;
  timezone: string;
  duration: string;
  amount: string;
  currency: string;
}

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [editedSchedule, setEditedSchedule] = useState<Schedule | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [currentGuestInput, setCurrentGuestInput] = useState<string>("");
  const [guestUsernames, setGuestUsernames] = useState<string[]>([]);
  const [guestSuggestions, setGuestSuggestions] = useState<string[]>([]);
  const [currentCoHostInput, setCurrentCoHostInput] = useState<string>("");
  const [coHostUsernames, setCoHostUsernames] = useState<string[]>([]);
  const [coHostSuggestions, setCoHostSuggestions] = useState<string[]>([]);
  const [meetingHistory, setMeetingHistory] = useState<any[]>([]);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const fetchSchedules = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/schedules/user-schedules/list`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch schedules");

      const data = await response.json();
      setSchedules(data.data.reverse());
      setLoading(false);
    } catch (error) {
      setError((error as Error).message || "An error occurred");
      setLoading(false);
    }
  }, []);

  const fetchMeetingHistory = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/rooms`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch meeting history");

      const data = await response.json();
      console.log(data);
      setMeetingHistory(data.data);
    } catch (error) {
      console.log("Error fetching meeting history:", error);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth?tab=signin");
    }
    fetchSchedules();
    fetchMeetingHistory();
  }, [fetchSchedules]);

  const formatTime = (timeString: string): string => {
    if (!timeString) return "N/A";
    const [hours, minutes] = timeString.split(":").map(Number);
    return new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusText = (schedule: Schedule): string => {
    if (schedule.isOngoing) return "Ongoing";
    const now = new Date();
    const sessionDate = new Date(`${schedule.date}T${schedule.startTime}`);
    const timeRemaining = sessionDate.getTime() - now.getTime();
    if (timeRemaining <= 0) return "Starting Soon";
    const minutesRemaining = Math.floor(timeRemaining / 1000 / 60);
    return `Starting in ${minutesRemaining} min`;
  };

  const handleStartLive = (roomCode: string) => {
    console.log(`Starting live session for schedule ID: ${roomCode}`);
    router.push(`/streaming/${roomCode}`);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedSchedule((prev) => {
      if (!prev) return prev;
      return { ...prev, [name]: value };
    });
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setEditedSchedule((prev) => {
        if (!prev) return prev;
        return { ...prev, date: date.toISOString().split("T")[0] };
      });
    }
  };

  const handleUpdate = async () => {
    if (!selectedSchedule) return;

    try {
      const response = await fetch(
        `${baseUrl}/schedules/${selectedSchedule.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          body: JSON.stringify(editedSchedule),
        }
      );

      if (!response.ok) throw new Error("Failed to update schedule");

      setSuccessMessage("Schedule updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
      setIsEditModalOpen(false);
      fetchSchedules();
    } catch (error) {
      setError((error as Error).message || "An error occurred while updating");
    }
  };

  const handleDelete = async () => {
    if (!selectedSchedule) return;

    try {
      const response = await fetch(
        `${baseUrl}/schedules/${selectedSchedule.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete schedule");

      setSuccessMessage("Schedule deleted successfully!");
      setIsDeleteModalOpen(false);
      fetchSchedules();
    } catch (error) {
      setError((error as Error).message || "An error occurred while deleting");
    }
  };

  const fetchUsernames = useCallback(
    async (
      query: string,
      setSuggestions: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
      if (!query) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await fetch(`${baseUrl}/users/?username=${query}`);
        const data = await response.json();
        setSuggestions(
          data.data.map((user: { username: string }) => user.username)
        );
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    },
    []
  );

  const handleGuestSelect = (username: string) => {
    if (!guestUsernames.includes(username)) {
      setGuestUsernames([...guestUsernames, username]);
    }
    setCurrentGuestInput("");
    setGuestSuggestions([]);
  };

  const handleCoHostSelect = (username: string) => {
    if (!coHostUsernames.includes(username)) {
      setCoHostUsernames([...coHostUsernames, username]);
    }
    setCurrentCoHostInput("");
    setCoHostSuggestions([]);
  };

  const removeGuestUsername = (index: number) => {
    setGuestUsernames(guestUsernames.filter((_, i) => i !== index));
  };

  const removeCoHostUsername = (index: number) => {
    setCoHostUsernames(coHostUsernames.filter((_, i) => i !== index));
  };

  const handleGuestKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (
      (event.key === "Enter" || event.key === ",") &&
      currentGuestInput.trim() !== ""
    ) {
      event.preventDefault();
      setGuestUsernames([...guestUsernames, currentGuestInput.trim()]);
      setCurrentGuestInput("");
    }
  };

  const handleCoHostKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (
      (event.key === "Enter" || event.key === ",") &&
      currentCoHostInput.trim() !== ""
    ) {
      event.preventDefault();
      setCoHostUsernames([...coHostUsernames, currentCoHostInput.trim()]);
      setCurrentCoHostInput("");
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsernames(currentGuestInput, setGuestSuggestions);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [currentGuestInput, fetchUsernames]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsernames(currentCoHostInput, setCoHostSuggestions);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [currentCoHostInput, fetchUsernames]);

  const renderDropdown = (
    suggestions: string[],
    onSelect: (username: string) => void
  ) => {
    if (!suggestions.length) return null;
    return (
      <ul className="dropdown-list border rounded shadow-md mt-1">
        {suggestions.map((username, index) => (
          <li
            key={index}
            className="dropdown-item p-2 hover:bg-gray-200 cursor-pointer"
            onClick={() => onSelect(username)}
          >
            {username}
          </li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-[85vh]">
      {/* <h1 className="text-2xl font-bold mb-4">Sessions you have scheduled</h1> */}
      <h1 className="text-2xl font-bold mb-4">Meeting History</h1>

      {
        meetingHistory.length > 0 && (
          <MeetingHistory meetings={meetingHistory} />
        )
      }
      {successMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className="bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">{schedule.title}</h2>
              <button
                onClick={() => {
                  setSelectedSchedule(schedule);
                  setIsViewModalOpen(true);
                }}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <span className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                {formatTime(schedule.startTime)}
              </span>
              <span className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {formatDate(schedule.date)}
              </span>
              <Link href={`/streaming/${schedule.room.roomCode}`}>
                Start Now
              </Link>
            </div>
            <div className="flex justify-between items-center">
              {/* <span className="text-sm font-medium text-gray-700">
                {getStatusText(schedule)}
              </span> */}
              <button
                onClick={() => handleStartLive(schedule.room.roomCode)}
                disabled={schedule.isOngoing}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  schedule.isOngoing
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                }`}
              >
                Start Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Modal */}
      <Transition show={isViewModalOpen} as={React.Fragment}>
        <Dialog
          onClick={() => setIsViewModalOpen(false)}
          onClose={() => setIsViewModalOpen(false)}
          className="fixed inset-0 z-40 overflow-y-auto"
        >
          <div className="min-h-screen px-4 text-center">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/25" />
            </TransitionChild>
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  View Schedule
                </DialogTitle>
                {selectedSchedule && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Title: {selectedSchedule.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Date: {formatDate(selectedSchedule.date)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Time: {formatTime(selectedSchedule.startTime)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Description: {selectedSchedule.description || "N/A"}
                    </p>
                  </div>
                )}
                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setEditedSchedule(selectedSchedule!);
                      setIsEditModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-red-900 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Modal */}
      <Transition show={isEditModalOpen} as={React.Fragment}>
        <Dialog
          onClose={() => setIsEditModalOpen(false)}
          className="fixed inset-0 z-40 overflow-y-auto"
        >
          <div className="min-h-screen px-4 text-center">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/25" />
            </TransitionChild>
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Edit Schedule
                </DialogTitle>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdate();
                  }}
                  className="mt-4"
                >
                  <div className="mb-4">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={editedSchedule?.title || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border  border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={editedSchedule?.description || ""}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Date
                    </label>
                    <DatePicker
                      selected={
                        editedSchedule?.date
                          ? new Date(editedSchedule.date)
                          : null
                      }
                      onChange={handleDateChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="startTime"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Start Time
                    </label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={editedSchedule?.startTime || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="endTime"
                      className="block text-sm font-medium text-gray-700"
                    >
                      End Time
                    </label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={editedSchedule?.endTime || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="timezone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Timezone
                    </label>
                    <select
                      id="timezone"
                      name="timezone"
                      value={editedSchedule?.timezone || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select timezone</option>
                      <option value="GMT">GMT</option>
                      <option value="PST">PST</option>
                      <option value="EST">EST</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="coHostUsername"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Co-Host Username
                    </label>
                    <input
                      type="text"
                      id="coHostUsername"
                      value={currentCoHostInput}
                      onChange={(e) => setCurrentCoHostInput(e.target.value)}
                      onKeyDown={handleCoHostKeyDown}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {renderDropdown(coHostSuggestions, handleCoHostSelect)}
                    {coHostUsernames.map((username, index) => (
                      <div key={index} className="tag flex items-center mt-1">
                        <span className="bg-blue-500 text-white rounded-full px-2 py-1">
                          {username}
                        </span>
                        <span
                          onClick={() => removeCoHostUsername(index)}
                          className="ml-2 cursor-pointer text-red-500"
                        >
                          &times;
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="guestUsername"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Guest Username
                    </label>
                    <input
                      type="text"
                      id="guestUsername"
                      value={currentGuestInput}
                      onChange={(e) => setCurrentGuestInput(e.target.value)}
                      onKeyDown={handleGuestKeyDown}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {renderDropdown(guestSuggestions, handleGuestSelect)}
                    {guestUsernames.map((username, index) => (
                      <div key={index} className="tag flex items-center mt-1">
                        <span className="bg-green-500 text-white rounded-full px-2 py-1">
                          {username}
                        </span>
                        <span
                          onClick={() => removeGuestUsername(index)}
                          className="ml-2 cursor-pointer text-red-500"
                        >
                          &times;
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Amount
                    </label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={editedSchedule?.amount || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="duration"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={editedSchedule?.duration || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="mt-4 flex justify-end space-x-4">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                      onClick={() => setIsEditModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition show={isDeleteModalOpen} as={React.Fragment}>
        <Dialog
          onClose={() => setIsDeleteModalOpen(false)}
          className="fixed inset-0 z-40 overflow-y-auto"
        >
          <div className="min-h-screen px-4 text-center">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/25" />
            </TransitionChild>
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Delete Schedule
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this schedule? This action
                    cannot be undone.
                  </p>
                </div>
                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
