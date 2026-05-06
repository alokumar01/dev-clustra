import { sendMessageService } from "./message.service.js";
// import { getIO } from "../../socket.server.js";

export const messageController = async(req, res, next) => {
    try {
        const receiverId = req.body.receiverId;
        const content = req.body.content;
        const type = req.body.type;
        const senderId = req.user._id;
        
        const { message, conversation } = await sendMessageService(senderId, receiverId, content, type);
        
        // const io = getIO();
        // io.to(`user:${receiverId}`).emit("new_message", message);
        // io.to(`chat:${conversationId}`); // for active chat UI OPTIONAL
        
        res.status(200).json({
            success: true,
            message: "Message sent",
            data: {
                message,
                conversationId: conversation._id
            }
        });
    } catch (error) {
        next(error);
    }
}

// Client A
//   ↓ (REST)
// POST /messages
//   ↓
// Service (DB write)
//   ↓
// Controller
//   ↓
// Socket emit
//   ↓
// Client B receives instantly