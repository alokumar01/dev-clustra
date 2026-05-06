import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

//  state
let isRefreshing = false;
let refreshQueue = [];

// run queued requests
const processQueue = (error) => {
  refreshQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
      console.log("Interceptor triggered", error?.response?.status);
    } else {
      promise.resolve();
    }
  });
  refreshQueue = [];
};


//  interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;

    if (originalRequest.url.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: () => resolve(api(originalRequest)),
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        console.log("🔥 Refresh called");

        await api.post("/auth/refresh");

        //  fetch fresh user after refresh
        const userRes = await api.get("/auth/me");

        useAuthStore.getState().setUser(userRes.data.user);

        processQueue();

        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError);

        const logout = useAuthStore.getState().logout;
        logout();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);