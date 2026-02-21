import Message from "./message.model.js"
import User from "../user/user.model.js"
import Conversation from "../conversation/conversation.model.js";
import ApiError from "../../helpers/apiError.js";


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
    
    if (!isSelfChat) {
        update.$inc = { [`unreadCount.${receiverId}`]: 1};
    }

    await Conversation.updateOne(
        {_id: conversation._id},
        update,
    )

    return { message, conversation };
}

