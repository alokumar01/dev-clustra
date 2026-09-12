import { randomUUID } from "crypto";
import { getIO } from "../../../socket.server.js";
import { sessionSocketAuth } from "./middleware/socket.middleware.js";
import { closeSessionService, newJoinParticipantService } from "./session.service.js";

// S1. SOCKET INITIALIZE, USE NAMESPACE FROM SOCKET TO USE GLOAL SOCKET SERVER
let sessionNamespace; // using sessionNamespace sends the event to the  who is doing an event too.

export const initSessionSocket = () => {
    const io = getIO(); // MAIN GLOBAL SERVER
    sessionNamespace = io.of("/session");

    // sessionNamespace.use((socket, next) => {
    //     try {
    //         const token = socket.handshake.auth.token;

    //         if (!token)
    //             throw new ApiError(
    //                 401,
    //                 "Session token not found",
    //                 "SESSION_NOT_AUTHORIZED",
    //             );

    //         const decode = jwt.verify(token, JWT_SECRET);
    //         console.log("DECODED TOKEN: ", decode);

    //         socket.participant = {
    //             participantId: decode.sub,
    //             sessionId: decode.sessionId,
    //             role: decode.role,
    //         };

    //         next();
    //     } catch (error) {
    //         next(new ApiError(401, "Invalid or expired session token", "SESSION_TOKEN_INVALID"));
    //     }
    // });
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
        const { participant } = await newJoinParticipantService(participantId);
        socket.to(room).emit("session:participant-joined", {
            // name: participantName,
            participant: {
                _id: participant._id,
                participantName: participant.displayName,
                role: participant.role
            },
            joinedAt
        });

        // send message listen the for the event -> I am listening for the even message:send
        socket.on("message:send", (data, ack) => {
            if (!data || typeof data !== "object") {
                return ack({
                    success: false,
                    message: "Invalid payload",
                });
            }

            const { content } = data;
            if (typeof content !== "string") {
                return ack({
                    success: false,
                    message: "Invalid payload.",
                });
            };

            const trimmedContent = content.trim();
            if (!trimmedContent) {
                return ack({
                    success: false,
                    message: "Invalid payload.",
                });
            }

            // LIMIT CHARACTER LENTH
            if (trimmedContent.length > 2000)
                return ack({
                    success: false,
                    message: "Message is too long.",
                });

            const message = {
                id: randomUUID(),
                participantId,
                content: trimmedContent,
                createdAt: new Date(),
            };

            // BROADCAST THE MESSAGE
            sessionNamespace.to(room).emit("message:new", message);

            ack({
                success: true,
                messageId: message.id,
            });
        });

        // SESSION CLOSED LISTEN EVENT VIA HOST
        socket.on("session:close", async (code, ack) => {
            if (!code) {
                return ack({
                    success: false,
                    message: "Session code is required to close the session."
                })
            }

            const result = await closeSessionService( participantId, sessionId, role );

            if (result.success !== true) {
                return ack({
                    success: false,
                    message: "Session is not closed UNKNOW REASON."
                })
            }

            //  CHANGES THIS TO ONLY PARTICAPNT GET NOTIFIED, NOT HOST ->done
            socket.to(room).emit("session:closed");

            ack({
                success: true,
                message: "Session Closed Successfully."
            })
        })

        // SESSION LEAVE BY PARTICIPANT INTENTIONAL
        socket.on("session:leave", async (code, ack) => {

            const leftAt = new Date();
            // const { participantName } = await newJoinParticipantService(participantId);

            socket.to(room).emit("session:participant-left", {
                participantId,
                leftAt
            })

            socket.leave(room);

            ack({
                success: true,
                message: "Left session successfully."
            });
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
