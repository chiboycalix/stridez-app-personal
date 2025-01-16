// ScheduleActions.js
"use client";
import React from "react";
import { useRouter } from "next/navigation";

type ScheduleActionsProps = {
  fetchScheduleDetails: any;
  handleDeleteClick: () => void;
  setIsEditing: any;
  scheduleDetails: any;
};
const ScheduleActions = ({
  fetchScheduleDetails,
  handleDeleteClick,
  setIsEditing,
  scheduleDetails,
}: ScheduleActionsProps) => {
  const router = useRouter();
  return (
    <div>
      <button className="flex mb-2">
        <img src={"/assets/Webinar.png"} alt="info" />{" "}
        <span className="ml-4">View Details</span>
      </button>
      <button onClick={() => setIsEditing(true)} className="flex mb-2">
        <img src={"/assets/EditIcon.png"} alt="Edit" />{" "}
        <span className="ml-4">Edit</span>
      </button>
      <button
        className="flex mb-2"
        onClick={() =>
          scheduleDetails &&
          router.push(`/ScheduleRemainder/${scheduleDetails.id}`)
        }
      >
        <img src={"/assets/BellOn.png"} alt="SetRemainder" />{" "}
        <span className="ml-4">Set Reminder</span>
      </button>
      <button className="flex mb-2">
        <img src={"/assets/PostIcon.png"} alt="SharePost" />{" "}
        <span className="ml-4">Share Post</span>
      </button>
      <button className="flex mb-2">
        <img src={"/assets/LinkIcon.png"} alt="ShareLink" />{" "}
        <span className="ml-4">Share Link</span>
      </button>
      <button onClick={handleDeleteClick} className="mb-2">
        Delete Schedule
      </button>
    </div>
  );
};

export default ScheduleActions;
