'use client'

import { api } from "@/lib/api/axios";
import { toast } from "sonner";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,

    setUser: (user) => set({
        user,
        isAuthenticated: true
    }),

    getMe: async () => {
        try {
            set({ isLoading: true });

            const response = await api.get("/auth/me");

            set({
                user: response.data.user,
                isAuthenticated: true
            });

        } catch (err) {
            const status = err.response?.status;

            if (status === 401) {
                set({
                    user: null,
                    isAuthenticated: false,
                });
            }

            return;

        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        try {
            set({ isLoading: true});

            const response = await api.get("/auth/logout");
            // console.log("Logout response without data:", response);
            // console.log("Logout response with data with message:", response.data);


            toast.success(response.data?.message);
            // redirect("/login");


        } catch (err) {
            toast.error(
                err.response?.message || "Logout failed"
            )
        } finally {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            })
        }
    }

}));
