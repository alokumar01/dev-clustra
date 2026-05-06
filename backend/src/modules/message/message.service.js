import Message from "./message.model.js"
import User from "../user/user.model.js"
import Conversation from "../conversation/conversation.model.js";
import ApiError from "../../helpers/apiError.js";
import { getIO, getUserSocket } from "../../socket.server.js";


export const sendMessageService = async(senderId, receiverId, content, type) => {
    if (!content) {
        throw new ApiError("Message is required", 400);
    }

    //allowing self chat
    const isSelfChat = senderId === receiverId;

    let conversation;
    if (isSelfChat) { // ha apne aap ko message karna hai
        conversation = await Conversation.findOne({
            participants: [senderId],
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants:  [senderId],
                unreadCount:{
                    [senderId]: 0,
                }
            });
        }       
    } else { // dusra user hai
        const receiver = await User.findById(receiverId);

        if (!receiver) {
            throw new ApiError("Receiver is not found", 400);
        }

        conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, receiverId],
            }
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

