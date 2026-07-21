import { api } from "@/lib/api/axios";

// Generate invite token client
export async function generateInviteToken() {
    try {
        const response = await api.post("/invites/generate")

        return response.data;

    } catch (error) {
        throw error;
    }
}

// Verify the invite token
export async function verifyInviteToken(token) {
    try {

        const response = await api.get(`/invites/verify/${token}`, {});

        return response.data;

    } catch (error) {
        throw error;
    }
}

// Accept the conversation
export async function acceptInvite(token) {
    try {
        const response = await api.post(`/invites/${token}/accept`);

        return response.data

    } catch (error) {
        throw error;
    }
}
