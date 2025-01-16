"use client";
import React, { useState, useEffect, useCallback } from "react";
import ScheduleDetailsView from "../../../components/schedules/ScheduleDetailsView";
import ScheduleDetailsEdit from "../../../components/schedules/ScheduleDetailsEdit";
import ScheduleActions from "../../../components/schedules/ScheduleActions";
import Cookies from "js-cookie";
import { baseUrl } from "@/utils/constant";
import { useParams, useRouter } from "next/navigation";
import { Schedule } from "../page";

export default function ScheduleDetailsContainer() {
  const [scheduleDetails, setScheduleDetails] = useState<Schedule | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState<Schedule>(
    scheduleDetails!
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const { id } = useParams();

  const fetchScheduleDetails = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/schedules/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      const data = await response.json();
      const schedule = await data?.data;
      setScheduleDetails(schedule);
      setEditedDetails({
        ...schedule,
      });
    } catch (error) {
      console.log("Error fetching schedule details:", error);
    }
  }, [baseUrl, id]);

  const handleDeleteClick = async () => {
    if (!scheduleDetails) {
      console.log("No schedule details available to delete");
      return;
    }

    try {
      const response = await fetch(
        `${baseUrl}/schedules/${scheduleDetails.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        setSuccessMessage("Schedule deleted successfully!");
        setTimeout(() => {
          setSuccessMessage("");
          router.push("/SchedulePage");
        }, 2000);
      }
    } catch (error) {
      console.log("Error deleting schedule:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditedDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleDateChange = (date: any) => {
    if (date) {
      setSelectedDate(date);
      setEditedDetails((prevDetails) => ({
        ...prevDetails,
        date: date.toISOString(),
      }));
    }
  };

  const handleUpdate = async () => {
    if (!scheduleDetails) {
      console.log("No schedule details available to update");
      return;
    }

    try {
      const response = await fetch(
        `${baseUrl}/schedules/${scheduleDetails.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          body: JSON.stringify(editedDetails),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setScheduleDetails(data.data);
        setIsEditing(false);
        setSuccessMessage("Schedule details updated successfully!");
        setTimeout(() => setSuccessMessage(""), 2000);
      } else {
        console.log("Error updating schedule details:", data);
      }
    } catch (error) {
      console.log("Network error updating schedule:", error);
    }
  };

  useEffect(() => {
    fetchScheduleDetails();
  }, [fetchScheduleDetails]);

  return (
    <div className="container">
      <div className="rounded bg-gray-50 gap-4">
        <div className="min-h-screen flex gap-3 justify-center items-center">
          <ScheduleActions
            fetchScheduleDetails={fetchScheduleDetails}
            handleDeleteClick={handleDeleteClick}
            setIsEditing={setIsEditing}
            scheduleDetails={scheduleDetails}
          />
          {isEditing ? (
            <ScheduleDetailsEdit
              editedDetails={editedDetails!}
              handleInputChange={handleInputChange}
              handleDateChange={handleDateChange}
              handleUpdate={handleUpdate}
              selectedDate={selectedDate}
              scheduleDetails={scheduleDetails!}
              setSuccessMessage={setSuccessMessage}
            />
          ) : scheduleDetails ? (
            <ScheduleDetailsView
              scheduleDetails={scheduleDetails}
              setIsEditing={setIsEditing}
              successMessage={successMessage}
            />
          ) : (
            <p>No schedule details available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
