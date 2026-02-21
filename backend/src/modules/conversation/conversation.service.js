// GET CONVERSATION LIST
import Conversation from "./conversation.model.js"
import ApiError from "../../helpers/apiError.js";
import Message from "../message/message.model.js"
import mongoose from "mongoose";

//GET ALL CONVERSATION
export const getAllConversationService = async(userId) => {
    // step 1
    if (!userId) {
        throw new ApiError();
    }

    //step 2; conversatoin me scan karo aur check karo ki kaha par user(logged in) hai
    const conversations = await Conversation.find({
        participants: userId
    })
    .populate("participants", "username avatar")
    .populate("lastMessage", "content messageType senderId")
    .sort({ lastMessageAt: -1 });
    
    //all data
    const inbox = conversations.map((conversation) => {
        const otherUser = conversation.participants.find(
            (user) => user._id.toString() !== userId.toString()
        );

        return {
            _id: conversation._id,
            chatWith: otherUser,
            lastMessage: conversation.lastMessage ? {
                content: conversation.lastMessage.content,
                messageType: conversation.lastMessage.messageType,
                senderId: conversation.lastMessage.senderId
            } 
            : null, 
            lastMessageAt: conversation.lastMessageAt,
            unreadCount: conversation.unreadCount?.[userId] || 0
        };
    });

    return inbox;
}

//GET SINGLE CONVERSATION
export const getConversationMessagesService = async(conversationId, userId, before, limit) => {
    if (!conversationId) {
        throw new ApiError(400, "Conversation is not found", "CONVERSATION_ID_REQUIRED");
    }

    const conversation = await Conversation.findById( conversationId )
    if (!conversation) {
        throw new ApiError(404, "Conversation is not found", "CONVERSATION_NOT_FOUND");
    }
    
    //check for security if not that user return 403
    //authorization check 
    const isParticipants = conversation.participants.some(p => p.toString() === userId.toString());
    if (!isParticipants) {
        throw new ApiError(403, "You are not part of this conversation", "ACCESS_DENIED_CHAT")
    }
    
    const query = { conversationId }
    if (before) {
        query.createdAt = { $lt: new Date(before) };
    }  

    // work with limit 
    const MAX_LIMIT = 30;
    let parsedLimit = parseInt(limit, 10);
    if (isNaN(parsedLimit) || parsedLimit <= 0 ) {
        parsedLimit = 20;
    }

    const requestedLimit = Math.min(parsedLimit, MAX_LIMIT);
    
    const messages = await Message.find(query)
        .sort({ createdAt: -1 })
        .limit( requestedLimit )
        .lean()
    
    const hasMore = messages.length > requestedLimit;

    if (hasMore) {
        messages.pop();
    }

    const nextCursor = hasMore ? messages[messages.length-1].createdAt : null;    

    return { 
        messages,
        nextCursor,
        hasMore
    };
}

//READ CONVERSATION MESSAGE (MARK AS READ)
export const readConversationMessagesService = async(conversationId, userId) => {
    if (!conversationId) {
        throw new ApiError(404, "Conversation is not found", "CONVERSATION_NOT_FOUND");
    }

    const conversation = await Conversation.findById(conversationId); // ye ek document lakar dega mujhe 
    if (!conversation) {
        throw new ApiError(404, "Conversation is not found", "CONVERSATION_NOT_FOUND");
    }

    const isParticipants = conversation.participants.some(p => p.toString() === userId.toString())
    if (!isParticipants) {
        throw new ApiError(403, "You are not part of this conversation", "CHAT_ACCESS_DENIED")
    }
    
    // I AM USING MONGODB TRANSACTIONS FOR MAINTAINING CONSISTENCY BETWEEN MESSAGE AND CONVERSATION

    //STEP1: START SESSION
    const session = await mongoose.startSession();
    try {
        //STEP2: START TRANSACTIONS
        session.startTransaction();
    
        //STEP3: PERFORM OPERATIONS;

        // update many messages readAt
        // Race Condition (Open Chat + New Message)  RACE CONDITION --> FIX WITH SERVER TIME AND createdAt <= readTime
        const readTime = new Date() // SERVER TIME
        const result = await Message.updateMany(
            {
                conversationId: conversationId,
                senderId: { $ne: userId },
                readAt: null,
                createdAt: { $lte: readTime }
            },
            {
                $set: { readAt: new Date() }
            },
            { session }
        );
            
        // now the question is, in message readAt update karne ke baad, 
        // if server crash then conversation me unread count kaise update hoga
        //SOLUTION --> MONGODB TRANSACTIONS

        // throw new Error("Simulated crash");

        //update conversation unread count
        await Conversation.updateOne(
            { _id: conversationId },
            {
                $set: { 
                    [`unreadCount.${userId.toString()}`]: 0 
                }
            },
            { session }
        )
        
        //STEP4: COMMIT
        await session.commitTransaction();
        
        return {
            modifiedCount: result.modifiedCount
        }
        
    } catch (error) {
        await session.abortTransaction();
        throw ApiError(500, "Failed to mark messages as read", "READ_MESSAGES_TRANSACTION_FAILED", "Mark as Read Transaction Failed")
    } finally {
        session.endSession();
    }
}