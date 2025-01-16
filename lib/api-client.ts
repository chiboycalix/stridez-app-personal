import axios from "axios";
import Cookies from "js-cookie";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASEURL,
  headers: {
    "Content-Type": "application/json",
    "Agora-Signature": "stridez@123456789",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          Cookies.remove("accessToken");
          window.location.href = "/auth?tab=signin";
          break;
        case 403:
          console.log("Forbidden access:", error.response.data);
          break;
        case 404:
          console.log("Resource not found:", error.response.data);
          break;
        default:
          console.log("API Error:", error.response.data);
      }

      return Promise.reject(error.response.data);
    } else if (error.request) {
      console.log("Network Error:", error.request);
      return Promise.reject(new Error("Network error occurred"));
    } else {
      console.log("Error:", error.message);
      return Promise.reject(error);
    }
  }
);
