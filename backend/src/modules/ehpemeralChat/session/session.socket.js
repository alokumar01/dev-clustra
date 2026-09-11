import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../config/env.js";
import ApiError from "../../../helpers/apiError.js";
import { getIO } from "../../../socket.server.js";


// S1. SOCKET INITIALIZE, USE NAMESPACE FROM SOCKET TO USE GLOAL SOCKET SERVER
let sessionNamespace;

export const initSessionSocket = () => {

    const io = getIO(); // MAIN GLOBAL SERVER
    sessionNamespace = io.of("/session");

    sessionNamespace.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            // console.log("Session token: ", token);

            if (!token)
                throw new ApiError(
            401,
            "Session token not found",
            "SESSION_NOT_AUTHORIZED",
        );

        const decode = jwt.verify(token, JWT_SECRET);

        socket.participant = {
            participantId: decode.sub,
            sessionId: decode.sessionId,
            role: decode.role,
        };

        next();
    } catch (error) {
        next(new ApiError(401, "Invalid or expired session token", "SESSION_TOKEN_INVALID"));
    }
});

    sessionNamespace.on("connection", (socket) => {
        // console.log("Welcome: You are connected with Session Socket");
        const { participantId, sessionId, role } = socket.participant;

        const room = `session: ${sessionId}`;
        socket.join(room);

        console.log(`Participant ${participantId} joined ${room} [${role}]`);

        console.log("Rooms:", sessionNamespace.adapter.rooms);
    })

    console.log("Session Socket namespace Initialized")
}



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
