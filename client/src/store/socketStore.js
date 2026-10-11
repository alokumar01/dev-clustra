import { io } from "socket.io-client";
import { create } from "zustand";

const SOCKET_URL= process.env.NEXT_PUBLIC_SOCKET_URL

export const useSocketStore = create((set) => ({
    connectionStatus: "offline",
    setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
}));

export const socket = io(SOCKET_URL, {
    autoConnect: false,
    withCredentials: true,
});


export const sessionSocket = io(`${SOCKET_URL}/session`, {
    autoConnect: false,
})
