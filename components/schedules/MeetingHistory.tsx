import { baseUrl } from "@/utils/constant";
import {
  Dialog,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import TimeFormatter from "@/utils/TimeFormatter";

interface Meeting {
  roomCode: string;
  startTime: string;
  endTime: string;
  id: string;
}

interface MeetingHistoryProps {
  meetings: Meeting[];
}

const MeetingHistory: React.FC<MeetingHistoryProps> = ({ meetings }) => {
  const [showMeetingAnalytics, setShowMeetingAnalytics] = useState(false);
  interface AnalyticsData {
    participantCount?: number;
    room?: {
      roomCode: string;
      startTime: string;
      endTime: string;
      roomSubscribers: { userId: string; username: string; isOwner: boolean; isCoHost: boolean }[];
    };
  }

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({});

  const fetchMeetingAnalytics = async (meetingCode: string) => {
    try {
      const response = await fetch(`${baseUrl}/rooms/meeting-analytics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        body: JSON.stringify({ roomCode: meetingCode }),
      });
      const data = await response.json();
      console.log(data);
      setAnalyticsData(data?.data);
    } catch (error) {
      console.error("Error fetching meeting analytics:", error);
    }
  };


  return (
    <>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "8px" }}>
              Room Code
            </th>
            <th style={{ border: "1px solid black", padding: "8px" }}>
              Start Time
            </th>
            <th style={{ border: "1px solid black", padding: "8px" }}>
              End Time
            </th>
            <th style={{ border: "1px solid black", padding: "8px" }}>ID</th>
          </tr>
        </thead>
        <tbody>
          {meetings.map((meeting) => (
            <tr
              key={meeting.id}
              onClick={() => {
                fetchMeetingAnalytics(meeting.roomCode);
                setShowMeetingAnalytics(true);
              }}
              style={{ cursor: "pointer" }}
            >
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {meeting.roomCode}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {meeting.startTime}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {meeting.endTime}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {meeting.id}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showMeetingAnalytics && (
        <Transition show={showMeetingAnalytics} as={React.Fragment}>
          <Dialog
            onClick={() => setShowMeetingAnalytics(false)}
            onClose={() => setShowMeetingAnalytics(false)}
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
                  <div className="mt-2">
                    {analyticsData && (
                      <div className="space-y-4">
                        <p className="text-sm font-medium text-gray-700">
                          Participants Count:{" "}
                          <span className="font-semibold text-gray-900">
                            {analyticsData?.participantCount}
                          </span>
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          Host:{" "}
                          <span className="font-semibold text-gray-900">
                            {analyticsData?.room?.roomSubscribers?.find((user) => user.isOwner)?.username || "You were a guest"}
                          </span>
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          Co-Host:{" "}
                          <span className="font-semibold text-gray-900">
                            {analyticsData?.room?.roomSubscribers?.find((user) => user.isCoHost)?.username || "No co-host"}
                          </span>
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          Room Code:{" "}
                          <span className="font-semibold text-gray-900">
                            {analyticsData?.room?.roomCode}
                          </span>
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          Start Time:{" "}
                          <span className="font-semibold text-gray-900">
                            {analyticsData?.room?.startTime}
                          </span>
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          End Time:{" "}
                          <span className="font-semibold text-gray-900">
                            {analyticsData?.room?.endTime}
                          </span>
                        </p>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Participants:
                          </p>
                          <div className="ml-4 space-y-1">
                            {analyticsData?.room?.roomSubscribers?.map((user) => (
                              <p key={user.userId} className="text-sm text-gray-900">
                                {user.username}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>
      )}
    </>
  );
};

export default MeetingHistory;
