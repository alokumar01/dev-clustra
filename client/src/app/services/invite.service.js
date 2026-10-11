import { api } from "@/lib/api/axios";

export async function generateInviteToken() {
    const response = await api.post("/invites/generate");
    return response.data;
}

export async function verifyInviteToken(token) {
    const response = await api.get(`/invites/verify/${token}`);
    return response.data;
}

export async function acceptInvite(token) {
    const response = await api.post(`/invites/${token}/accept`);
    return response.data;
}
