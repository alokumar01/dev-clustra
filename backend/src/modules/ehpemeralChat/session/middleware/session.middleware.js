import ApiError from "../../../../helpers/apiError.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../../config/env.js";
import Participant from "../participants.model.js";

export const sessionAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Authorization:", req.headers.authorization);

    if (!authHeader)
      throw new ApiError(
        401,
        "Session token not found",
        "SESSION_NOT_AUTHORIZED",
      );

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1] : authHeader;

    const decode = jwt.verify(token, JWT_SECRET);
    console.info("DECODED IN SESSION AUTH: ", decode)

    // const sessionId = decode.sessionId;
    const participantId = decode.sub;
    // const role = decode.role;

    const participant = await Participant.findById(participantId);

    if (!participant)
      throw new ApiError(
        401,
        "The user is not belongs to this session.",
        "PARTICIAPNT_NOT_EXIST",
      );

    req.participant = {
      participantId: participant._id,
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
