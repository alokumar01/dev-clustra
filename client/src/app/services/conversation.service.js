import { api } from "@/lib/api/axios";

export async function fetchAllConversations() {
    const response = await api.get("/conversations");
    return response.data;
}

export async function fetchSingleChatConversation(
    conversationId,
    { before, limit } = {}
) {
    const response = await api.get(`/conversations/${conversationId}/messages`, {
        params: {
            before,
            limit
        }
    });
    return response.data;
}

export async function markAsRead(conversationId) {
    const response = await api.post(`/conversations/${conversationId}/read`);
    return response.data;
}

export async function sendMessage(data) {
    const response = await api.post("/messages", data);
    return response.data;
}
