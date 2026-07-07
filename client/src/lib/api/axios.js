import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Set a timeout of 10 seconds for all requests
}, );

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
      toast.error("Network error. Please check your connection.");
      return Promise.reject(error);
    }

    const status = error.response.status;

    if (status >= 500) {
      toast.error("Server error. Please try again later.");
      return Promise.reject(error);
    }

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
        console.log("Refresh called");

        await api.post("/auth/refresh");

        //  fetch fresh user after refresh
        const userRes = await api.get("/auth/me");

        useAuthStore.getState().setUser(userRes.data.user);

        processQueue();

        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError);

        // handle logout on refresh failure
        useAuthStore.setState({
          user: null,
          isAuthenticated: false,
        })
        // const logout = useAuthStore.getState().logout;
        // logout();

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


// Refresh Flow
  // API Call
  //    ↓
  // 401
  //    ↓
  // Interceptor
  //    ↓
  // /auth/refresh
  //    ↓
  // New Tokens
  //    ↓
  // Retry Original Request

  // Refresh doesn't happen automatically after 15 min.
  // It only happens when a request gets 401.


// Why _retry?
  // Prevent infinite loop.
  // 401
  //  ↓
  // Refresh
  //  ↓
  // 401
  //  ↓
  // Refresh ❌
  // Only retry once.

// Why isRefreshing?

// If 5 requests get 401 together,

// ❌ Without it:

// Refresh x5

// ✅ With it:

// One Refresh
// Others Wait
// Why refreshQueue?

// Stores waiting requests.

// After refresh:

// Refresh Success
//       ↓
// Retry All Waiting Requests
// Why getMe() after refresh?

// Backend has latest user.

// Refresh
//    ↓
// getMe()
//    ↓
// Update Zustand

// Keeps frontend synced.

// Why NOT logout() in interceptor?

// Already made this mistake 

// Logout
//  ↓
// 401
//  ↓
// Interceptor
//  ↓
// logout()
//  ↓
// Loop

// Instead:

// setState({
//   user: null,
//   isAuthenticated: false,
// });

// Let AuthGuard/Router redirect.

// Interceptor Handles
// ✅ 401 → Refresh & Retry
// ✅ Network Error → Toast
// ✅ 500 → Toast
// ❌ Doesn't redirect
// ❌ Doesn't show success toasts
// ❌ Doesn't contain business logic
// Responsibilities
// Middleware → Can user access this route?
// AuthProvider → Get current user on app start.
// Axios → Keep API requests authenticated.
// Zustand → Store auth state.
// Components/AuthGuard → Redirect & UI.
