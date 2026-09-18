import ApiError from "../../helpers/apiError.js";
import { getIO, getUserSocket } from "../../socket.server.js";
import Conversation from "../conversation/conversation.model.js";
import User from "../user/user.model.js";
import Message from "./message.model.js";


export const sendMessageService = async(senderId, receiverId, content, type) => {
    if (!receiverId || typeof receiverId.toString !== "function") {
        throw new ApiError(400, "Receiver is required", "RECEIVER_REQUIRED");
    }
    if (typeof content !== "string" || !content.trim()) {
        throw new ApiError(400, "Message is required", "MESSAGE_REQUIRED");
    }
    if (content.trim().length > 2000) {
        throw new ApiError(400, "Message cannot exceed 2000 characters", "MESSAGE_TOO_LONG");
    }
    if (!["text", "image", "link", "code"].includes(type)) {
        throw new ApiError(400, "Invalid message type", "INVALID_MESSAGE_TYPE");
    }

    content = content.trim();

    //allowing self chat
    const isSelfChat = senderId.toString() === receiverId.toString();

    let conversation;
    if (isSelfChat) { // ha apne aap ko message karna hai
        conversation = await Conversation.findOne({
            participants: senderId,
            type: "private",
            $expr: {
                $eq: [{ $size: "$participants" }, 1]
            },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants:  [senderId],
                type: "private",
                lastMessage: null,
                unreadCount:{
                    [senderId]: 0,
                }
            });
        }

    } else { // dusra user hai
        const receiver = await User.findById(receiverId);

        if (!receiver) {
            throw new ApiError(400, "Receiver is not found", "RECEIVER_NOT_FOUND");
        }

        conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, receiverId],
                $size: 2,
            },
            type: "private"
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
                lastMessage: null,
                unreadCount: {
                    [senderId]: 0,
                    [receiverId]: 0
                }
            });
        }
    }

    //message model creating
    const message = await Message.create({
        conversationId: conversation._id,
        senderId,
        messageType: type,
        content,
        deliveredAt: new Date(),
    });


    //updating conversation metadata
    const update = {
        lastMessage: message._id,
        lastMessageAt: new Date(),
    };

    const receiverSocket = getUserSocket(receiverId);
    const isReceiverActive = receiverSocket && receiverSocket.activeConversation === conversation._id.toString();

    if (!isSelfChat) {
        if (!isReceiverActive) {
            update.$inc = { [`unreadCount.${receiverId}`]: 1};
        } else {
            update.$set = { [`unreadCount.${receiverId}`]: 0};
        }

    }

    await Conversation.updateOne(
        {_id: conversation._id},
        update,

    )
    // TESTING SOCKET

    // Send to active chat room user
    const io = getIO();
    io.to(`chat:${conversation._id}`).emit("new_message", {
        ...message.toObject(),
        conversationId: conversation._id,
    });

    // send message who is online but not viewing the chat
    io.to(`user:${receiverId}`).emit("new_message", {
        ...message.toObject(),
        conversationId: conversation._id,
    });

    return { message, conversation };
}
