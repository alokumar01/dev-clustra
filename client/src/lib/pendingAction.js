
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
    } catch (error) {
        console.log("Failed to parse pending action: ", error);
        return null;
    }
};

export const clearPendingAction = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(PENDING_ACTION_CHANGED_EVENT));
};
