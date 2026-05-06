import express from "express"
import { getAllConversationController, getConversationMessagesController, readConversationMessagesController } from "./conversation.controller.js"
import { protect } from "../../middleswares/auth.middleware.js";
const router = express.Router();

router.get("/", protect, getAllConversationController )
router.get("/:conversationId/messages", protect, getConversationMessagesController);
router.post("/:conversationId/read", protect, readConversationMessagesController)



export default router;