import { apiClient } from "../api-client";

type Meeting = {
  code: number;
  statusCode: number;
  status: string;
  data: {
    roomCode: string;
    startTime: string;
    userId: number;
  };
};
export const MEETINGS_API = {
  createInstantMeeting: async (): Promise<Meeting> => {
    return apiClient.post("/rooms/create-instant-meeting", {
      roomType: "instant",
    });
  },
};
