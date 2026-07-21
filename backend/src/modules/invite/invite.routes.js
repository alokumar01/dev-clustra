import express from "express";
import { protect } from "../../middleswares/auth.middleware.js";
import limiter from "../../config/rateLimit.js"
import { acceptInviteController, generateInviteController, verifyInviteController } from "./invite.controller.js";
const router = express.Router();

router.post("/generate", protect, limiter, generateInviteController );
router.get("/verify/:token", limiter, verifyInviteController);
router.post("/:token/accept", protect, limiter, acceptInviteController)

export default router;
