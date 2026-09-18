import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../../config/env.js";
import ApiError from "../../../../helpers/apiError.js";
import Participant from "../participants.model.js";
import Session from "../session.model.js";

export const sessionSocketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token)
      throw new ApiError(
        401,
        "Session token not found",
        "SESSION_NOT_AUTHORIZED",
      );

    const decode = jwt.verify(token, JWT_SECRET);
    // console.log("DECODED IN SOCKET MIDDLEWARE: ", decode);

    // VERIFY THE TOKEN;
    const sessionId = decode.sessionId;
    const participantId = decode.sub;
    const role = decode.role;

    // FIRST CHECK SESSION EXIST
    const session = await Session.findById(sessionId);
    // console.log("SESSION FOUND IN MIDDLEWARE: ", session);

    if (!session)
      throw new ApiError(404, "Session does not exist", "SESSION_NOT_EXIST");

    if (session.expiresAt <= new Date())
        throw new ApiError(401, "Session has expired", "SESSION_EXPIRED");

    // CHECK SESSION IS ACTIVE
    if (session.status === "CLOSED")
      throw new ApiError(401, "Session is closed ", "SESSION_CLOSED");

    // CHECK PARTICIPANT
    const participant = await Participant.findById(participantId);
    if (!participant)
      throw new ApiError(404, "Participant not found", "PARTICIPANT_NOT_FOUND");

    if (participant.sessionId.toString() !== sessionId.toString()) {
      throw new ApiError(
        403,
        "Participant does not belong to this session",
        "PARTICIPANT_SESSION_MISMATCH",
      );
    }

    // CHECK ROLE
    if (participant.role !== role) {
      throw new ApiError(
        403,
        "Invalid participant role",
        "INVALID_PARTICIPANT_ROLE",
      );
    }

    // ATTACH THE VERIFYED USER TO SOCKET REQUEST
    socket.participant = {
      participantId: decode.sub,
      sessionId: decode.sessionId,
      role: decode.role,
    };

    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Session token expired", "SESSION_TOKEN_EXPIRED"));
    }

    if (error.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Invalid session token", "INVALID_SESSION_TOKEN"));
    }

    next(error);
  }
};
