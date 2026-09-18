import { randomUUID } from "crypto";
import { getIO } from "../../../socket.server.js";
import { sessionSocketAuth } from "./middleware/socket.middleware.js";
import { assertActiveSession, closeSessionService, newJoinParticipantService } from "./session.service.js";

// S1. SOCKET INITIALIZE, USE NAMESPACE FROM SOCKET TO USE GLOAL SOCKET SERVER
let sessionNamespace; // using sessionNamespace sends the event to the  who is doing an event too.

export const initSessionSocket = () => {
    const io = getIO(); // MAIN GLOBAL SERVER
    sessionNamespace = io.of("/session");

    sessionNamespace.use(sessionSocketAuth);

    sessionNamespace.on("connection", async (socket) => {
        // console.log("Welcome: You are connected with Session Socket");
        const { participantId, sessionId, role } = socket.participant;

        // const { participantId, sessionId, role } = sessionSocketAuth();
        // console.log("IN SESSION SOCKET: ", participantId, sessionId, role);

        const room = `session:${sessionId}`;

        socket.join(room);
        const joinedAt = new Date();

        console.log(`Participant [ ${participantId} ] [ joined ${room} ] [ ${role} ]`);

        // SESSION JOINED EVENT EMIT
        let participant;
        try {
            ({ participant } = await newJoinParticipantService(participantId));
            socket.to(room).emit("session:participant-joined", {
                participant: {
                    _id: participant._id,
                    displayName: participant.displayName,
                    role: participant.role,
                },
                joinedAt,
            });
        } catch (error) {
            socket.emit("session:error", {
                success: false,
                message: error?.message || "Unable to join session.",
            });
            socket.disconnect(true);
            return;
        }

        // send message listen the for the event -> I am listening for the even message:send
        socket.on("message:send", async (data, ack) => {
            try {
                await assertActiveSession(sessionId);

                if (!data || typeof data !== "object") {
                        return ack?.({
                            success: false,
                            message: "Invalid payload",
                        });
                }

                const { content } = data;
                if (typeof content !== "string") {
                    return ack?.({
                        success: false,
                        message: "Invalid payload.",
                    });
                };

                const trimmedContent = content.trim();
                if (!trimmedContent) {
                    return ack?.({
                        success: false,
                        message: "Invalid payload.",
                    });
                }

                // LIMIT CHARACTER LENTH
                if (trimmedContent.length > 2000)
                    return ack?.({
                        success: false,
                        message: "Message is too long.",
                    });

                const message = {
                    id: randomUUID(),
                    participantId,
                    participantName: participant.displayName,
                    content: trimmedContent,
                    createdAt: new Date(),
                };

                // BROADCAST THE MESSAGE
                sessionNamespace.to(room).emit("message:new", message);

                ack?.({
                    success: true,
                    messageId: message.id,
                });
            } catch (error) {
                ack?.({
                    success: false,
                    code: error?.code || "SESSION_MESSAGE_FAILED",
                    message: error?.message || "Unable to send message.",
                });

                if (error?.code === "SESSION_EXPIRED" || error?.code === "SESSION_CLOSED") {
                    socket.emit("session:closed");
                    socket.disconnect(true);
                }
            }
        });

        // SESSION CLOSED LISTEN EVENT VIA HOST
        socket.on("session:close", async (data, ack) => {
            try {
                if (!data?.code) {
                    return ack?.({
                        success: false,
                        message: "Session code is required to close the session.",
                    });
                }

                const result = await closeSessionService(participantId, sessionId, role);

                if (result.success !== true) {
                    return ack?.({
                        success: false,
                        message: "Session could not be closed.",
                    });
                }

                sessionNamespace.to(room).emit("session:closed");

                ack?.({
                    success: true,
                    message: "Session closed successfully.",
                });

                sessionNamespace.in(room).disconnectSockets(true);
            } catch (error) {
                ack?.({
                    success: false,
                    message: error?.message || "Unable to close the session.",
                });
            }
        })

        // SESSION LEAVE BY PARTICIPANT INTENTIONAL
        socket.on("session:leave", async (data, ack) => {
            try {
                const leftAt = new Date();
                const { participant } = await newJoinParticipantService(participantId);

                socket.to(room).emit("session:participant-left", {
                    participant: {
                        _id: participant._id,
                        displayName: participant.displayName,
                        role: participant.role,
                    },
                    leftAt,
                });

                socket.leave(room);

                ack?.({
                    success: true,
                    message: "Left session successfully.",
                });
            } catch (error) {
                ack?.({
                    success: false,
                    message: error?.message || "Unable to leave the session.",
                });
            }
        });



        socket.on("disconnect", () => {
            console.log("Participant disconnected:", participantId);
        });
    });

    console.log("Session Namespace Socket Initialized");
};

// }

//          ONE SOCKET.IO SERVER
//                  │
//       ┌──────────┴──────────┐
//       │                     │
//       ▼                     ▼
//   "/" namespace       "/session" namespace
//       │                     │
//       │                     │
// normal user JWT       session JWT
//       │                     │
//   cookie              handshake.auth

//                 HTTP SERVER
//                     │
//                     ▼
//              Socket.IO SERVER
//                     │
//          ┌──────────┴──────────┐
//          │                     │
//          ▼                     ▼
//    ROOT NAMESPACE         /session
//          │                     │
//          │                     │
//    io.use()              sessionNamespace.use()
//          │                     │
//    accessToken             session JWT
//      cookie                    │
//          │                     │
//          ▼                     ▼
//     socket.user        socket.participant
//          │                     │
//          ▼                     ▼
//    normal chat          temporary chat
//          │                     │
//          ▼                     ▼
// chat:conversationId     session:sessionId
