import { api } from "@/lib/api/axios";
import { getPendingAction } from "@/lib/pendingAction";

// CREATE A SESSION
export async function CreateSession() {
    try {
        const response = await api.post("/sessions");
        // console.log("Data from service session: ", response);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// VERIFY A SESSION
export async function VerifySesssion(code) {
    try {
        const response = await api.get(`/sessions/${code}`, {});
        // console.log("Data from service verify: ", response);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// JOIN A SESSION
export async function JoinSession(code, name) {
    try {
        const response = await api.post(`/sessions/${code}/join`, {name});
        return response.data;
    } catch (error) {
        throw error;
    }
}


// GET ALL PARTICIAPNT LIST
// GET TOKEN FROM SESSION STORAGE FOR THIS

export async function GetAllParticipants(code) {
    try {
        const action = getPendingAction()
        const { token } = action.payload
        // console.log("INSIDE GET ALL CLIENT ROUTES: ", token)

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
