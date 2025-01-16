"use client";

import { baseUrl } from "@/utils/constant";
import React, { useState, useCallback, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Schedule } from "../../app/schedule/page";

interface ScheduleDetailsEditProps {
  editedDetails: Schedule;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleDateChange: (date: any) => void;
  handleUpdate: () => void;
  selectedDate: Date | null;
  scheduleDetails: Schedule;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
}

const ScheduleDetailsEdit: React.FC<ScheduleDetailsEditProps> = ({
  editedDetails,
  handleInputChange,
  handleDateChange,
  handleUpdate,
  selectedDate,
  scheduleDetails,
  setSuccessMessage,
}) => {
  const [currentGuestInput, setCurrentGuestInput] = useState<string>("");
  const [guestUsernames, setGuestUsernames] = useState<string[]>([]);
  const [guestSuggestions, setGuestSuggestions] = useState<string[]>([]);
  const [currentCoHostInput, setCurrentCoHostInput] = useState<string>("");
  const [coHostUsernames, setCoHostUsernames] = useState<string[]>([]);
  const [coHostSuggestions, setCoHostSuggestions] = useState<string[]>([]);

  const fetchScheduleDetails = useCallback(async () => {
    try {
      const response = await fetch(
        `${baseUrl}/schedules/${scheduleDetails.id}`
      );
      const data = await response.json();
      console.log("selected details:", data.data);
    } catch (error) {
      console.log("Error fetching schedule details:", error);
    }
  }, [baseUrl, scheduleDetails.id]);

  useEffect(() => {
    fetchScheduleDetails();
  }, [fetchScheduleDetails]);

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
    [baseUrl]
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

  const handleGuestKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (event.key === "Enter" || event.key === ",") &&
      currentGuestInput.trim() !== ""
    ) {
      event.preventDefault();
      setGuestUsernames([...guestUsernames, currentGuestInput.trim()]);
      setCurrentGuestInput("");
    }
  };

  const handleCoHostKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
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

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Edit Webinar</h1>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block mb-1 font-medium">Title:</label>
          <input
            type="text"
            name="title"
            value={scheduleDetails?.title || ""}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description:</label>
          <textarea
            name="description"
            value={editedDetails?.description || ""}
            onChange={handleInputChange}
            className="border rounded p-2 w-full h-24"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Start Time:</label>
            <input
              type="time"
              name="startTime"
              value={editedDetails?.startTime || ""}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">End Time:</label>
            <input
              type="time"
              name="endTime"
              value={editedDetails?.endTime || ""}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">Timezone:</label>
          <select
            id="selectedTimezone"
            name="timezone"
            className="border rounded p-2 w-full"
            value={editedDetails?.timezone || ""}
            onChange={handleInputChange}
            required
          >
            <option value="">Select timezone</option>
            <option value="GMT">GMT</option>
            <option value="PST">PST</option>
            <option value="EST">EST</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Co-Host Username:</label>
          <input
            type="text"
            name="coHostUsername"
            value={currentCoHostInput}
            onChange={(e) => setCurrentCoHostInput(e.target.value)}
            onKeyDown={handleCoHostKeyDown}
            className="border rounded p-2 w-full"
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
        <div>
          <label className="block mb-1 font-medium">Guest Username:</label>
          <input
            type="text"
            name="guestUsername"
            value={currentGuestInput}
            onChange={(e) => setCurrentGuestInput(e.target.value)}
            onKeyDown={handleGuestKeyDown}
            className="border rounded p-2 w-full"
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
        <div>
          <label className="block mb-1 font-medium">Amount:</label>
          <input
            type="number"
            name="amount"
            value={editedDetails?.amount || ""}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Duration:</label>
          <input
            type="number"
            name="duration"
            value={editedDetails?.duration || ""}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
          />
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            Update Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetailsEdit;
