import { api } from "@/lib/api/axios";
import { getPendingAction } from "@/lib/pendingAction";

export async function createSession() {
    const response = await api.post("/sessions");
    return response.data;
}

export async function verifySessionCode(code) {
    const response = await api.get(`/sessions/${code}`);
    return response.data;
}

export async function joinSession(code, name) {
    const response = await api.post(`/sessions/${code}/join`, { name });
    return response.data;
}

export async function getAllParticipants(code) {
    try {
        const action = getPendingAction()
        const { token } = action.payload
        const response = await api.get(`/sessions/${code}/participants`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}
