import { sendMessageService } from "./message.service.js";

export const messageController = async(req, res, next) => {
    try {
        const receiverId = req.body.receiverId;
        const content = req.body.content;
        const type = req.body.type;
        const senderId = req.user._id;
        
        const { message, conversationId } = await sendMessageService(senderId, receiverId, content, type);

        res.status(200).json({
            success: true,
            message: "Message sent",
            data: {
                message,
                conversationId,
            }
        });
    } catch (error) {
        next(error);
    }
}

