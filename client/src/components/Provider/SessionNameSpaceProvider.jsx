'use client'

import { getPendingAction, PENDING_ACTION_CHANGED_EVENT } from "@/lib/pendingAction";
import { sessionSocket } from "@/store/socketStore";
import { useEffect } from "react";
import { logger } from "@/lib/logger";


export default function SessionNameSpaceSocketProvider({ children }) {
    useEffect(() => {
        const handleConnect = () => {
            logger.info("socket.session.connected", { area: "session_socket" });
        };

        const handleConnectError = (error) => {
            logger.error(
                "socket.session.connection_failed",
                { area: "session_socket" },
                error,
            );
        };

        const connectSessionSocket = () => {
            const sessionData = getPendingAction();
            const token = sessionData?.payload?.token;

            if (!token) {
                if (sessionSocket.connected) {
                    sessionSocket.disconnect();
                }
                return;
            }

            sessionSocket.auth = { token };

            if (!sessionSocket.connected) {
                sessionSocket.connect();
            }
        };


        sessionSocket.on("connect", handleConnect);
        sessionSocket.on("connect_error", handleConnectError);
        window.addEventListener(PENDING_ACTION_CHANGED_EVENT, connectSessionSocket);

        connectSessionSocket();

        return () => {
            window.removeEventListener(PENDING_ACTION_CHANGED_EVENT, connectSessionSocket);
            sessionSocket.off("connect", handleConnect);
            sessionSocket.off("connect_error", handleConnectError);
            sessionSocket.disconnect();
        };
    }, []);


    return children;
}
