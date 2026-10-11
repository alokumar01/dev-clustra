
import { logger } from "@/lib/logger";

const STORAGE_KEY = "pendingAction";
export const PENDING_ACTION_CHANGED_EVENT = "pending-action:changed";

export const savePendingAction = (action) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(action));
    window.dispatchEvent(new CustomEvent(PENDING_ACTION_CHANGED_EVENT, {
        detail: action,
    }));
};

export const getPendingAction = () => {
    const data = sessionStorage.getItem(STORAGE_KEY);

    if (!data) return null;

    try {
        return JSON.parse(data);
    } catch {
        logger.warn("pending_action.parse_failed", { area: "session_storage" });
        return null;
    }
};

export const clearPendingAction = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(PENDING_ACTION_CHANGED_EVENT));
};
