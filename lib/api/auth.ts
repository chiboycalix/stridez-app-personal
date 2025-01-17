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
  validateOTP: async ({ token }: { token: string }) => {
    console.log(token, "calix");
    return apiClient.post("/auth/validate-otp", {
      token,
      triggerEvent: "account-creation",
    });
  },
  resendOTP: async (email: string) => {
    return apiClient.post("/auth/send-otp", {
      email: email,
      triggerEvent: "account-creation",
    });
  },
  updateProfile: async (profileData: any) => {
    return apiClient.put("/profiles", {
      ...profileData,
    });
  },
};
