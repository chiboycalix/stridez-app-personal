import { apiClient } from "../api-client";

export const AUTH_API = {
  signIn: async (data: { email: string; password: string }) => {
    return apiClient.post("/auth/login", {
      ...data,
    });
  },
  signUp: async (data: { email: string; password: string }) => {
    return apiClient.post("/auth/register", {
      ...data,
    });
  },
};
