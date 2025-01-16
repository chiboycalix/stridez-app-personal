"use client";

import React from "react";
import CoHostList from "../../app/live/CoHostList";
import GuestList from "../../app/live/GuestList";
import { Schedule } from "../../app/schedule/page";

type ScheduleDetailsViewProps = {
  scheduleDetails: Schedule;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  successMessage: string;
};
const ScheduleDetailsView = ({
  scheduleDetails,
  setIsEditing,
  successMessage,
}: ScheduleDetailsViewProps) => {
  return (
    <div>
      {successMessage && (
        <div className="bg-green-200 text-green-800 p-2 rounded mb-2">
          {successMessage}
        </div>
      )}
      <div>
        <strong>Title:</strong> {scheduleDetails?.title}
      </div>
      <div>
        <strong>Description:</strong> {scheduleDetails?.description}
      </div>
      <div>
        <strong>Start Time:</strong> {scheduleDetails?.startTime}
      </div>
      <div>
        <strong>End Time:</strong> {scheduleDetails?.endTime}
      </div>
      <div>
        <strong>Date:</strong> {scheduleDetails?.date}
      </div>
      <div>
        <strong>Timezone:</strong> {scheduleDetails?.timezone}
      </div>
      <div>
        <strong>Co Hosts:</strong>
        <CoHostList roomSubscribers={scheduleDetails?.room?.roomSubscribers} />
      </div>
      <div>
        <strong>Guests</strong>
        <GuestList roomSubscribers={scheduleDetails?.room?.roomSubscribers} />
      </div>
      <div>
        <strong>Payment:</strong> {scheduleDetails?.currency}
        {scheduleDetails?.amount}
      </div>
    </div>
  );
};

export default ScheduleDetailsView;
