import express from "express";
import { protect } from "../../middleswares/auth.middleware.js";
import { validate } from "../../middleswares/validation.middleware.js";
import { messageController } from "./message.controller.js";
import { messageSchema } from "./message.validation.js";
const router = express.Router();

router.post("/", protect, validate(messageSchema), messageController);


export default router;
