import express from "express";
import { protect } from "../../middleswares/auth.middleware.js";
import { messageController } from "./message.controller.js";
const router = express.Router();

router.post("/", protect, messageController);


export default router;