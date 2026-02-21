import { getAllConversationService, getConversationMessagesService, readConversationMessagesService } from "./conversation.service.js";

// GET ALL CONVERSATION
export const getAllConversationController = async (req, res, next) => {
    try {
        // logic ye hai ki, jo login hoga wo apne app ko conversation modle me search karega then jaha bhi logged in user
        // raha wo uske sare friends list hai and wo data me conversation list se fetch kar sakta hu
        const userId = req.user._id;

        const conversations = await getAllConversationService(userId);

        res.status(200).json({
            success: true,
            message: "All conversation list",
            data: conversations
        });
    } catch (error) {
        next(error);
    }
}

// GET SINGLE CONVERSATION
export const getConversationMessagesController = async (req, res, next) => {
    try {
        const { conversationId } = req.params;
        const { before, limit } = req.query;
        const userId = req.user._id;

        const messages = await getConversationMessagesService(conversationId, userId, before, limit);

        res.status(200).json({
            success: true,
            message: "All messages",
            data: messages
        });

    } catch (error) {
        next(error);
    }
}

//READ THE MESSAGE
export const readConversationMessagesController = async(req, res, next) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user._id;
        
        const result = await readConversationMessagesService(conversationId, userId);
        
        res.status(200).json({
            success: true,
            message: "Messages read done",
            data: result.modifiedCount
        })
    } catch (error) {
        next(error)
    }
}
