import { api } from "@/lib/api/axios";

// FETCH ALL CONVERSATIONS
export async function FetchAllConversations() {
    try {

        const response = await api.get("/conversations");

        return response.data;

    } catch (error) {
        throw error;
    }
}

// FETCH SINGLE CONVERSATION WITH MESSAGES
export async function FetchSingleChatConversation(
        conversationId,
        { before, limit } = {}
    ) {
    try {

        const response = await api.get(`/conversations/${conversationId}/messages`, {
            params: {
                before,
                limit
            }
        });
        // console.group("Fetched single chat conversation:", response.data);

        return response.data;

    } catch (error) {
        throw error;
    }
}

// MARK AS READ AND RESET UNREAD COUNT
export async function MarkAsRead(conversationId) {
    try {

        const response = await api.post(`/conversations/${conversationId}/read`);

        return response.data;

    } catch (error) {
        throw error;
    }
}

// SEND MESSAGES
export async function SendMessage(data) {
    try {
        const response = await api.post("/messages", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}
