import Conversation from "../conversation/conversation.model.js";
import User from "./user.model.js";

export const searchUsersService = async (searchTerm, currentUserId) => {
    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const conversations = await Conversation.find({
        participants: currentUserId,
        type: "private"
    }).populate("participants", "username avatar bio");

    const users = conversations.flatMap((conversation) =>
        conversation.participants.filter((user) => user._id.toString() !== currentUserId.toString())
    );

    const seen = new Set();
    return users.filter((user) => {
        const id = user._id.toString();
        if (seen.has(id) || !new RegExp(escapedSearchTerm, "i").test(user.username)) return false;
        seen.add(id);
        return true;
    });
};


export const checkUsernameService = async(searchUsername) => {
    const user = await User.findOne({
        username: searchUsername,
    });

    return {
        available: !user,
        // !user is false --> means username is not available
        // user is null --> means username is available means not found any document

    };
}
