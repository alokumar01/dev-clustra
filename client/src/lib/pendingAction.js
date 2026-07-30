
const STORAGE_KEY = "pendingAction";

export const savePendingAction = (action) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(action));
};

export const getPendingAction = () => {
    const data = sessionStorage.getItem(STORAGE_KEY);

    if (!data) return null;

    try {
        return JSON.parse(data);
    } catch (error) {
        return error;
    }
};

export const clearPendingAction = () => {
    sessionStorage.removeItem(STORAGE_KEY);
};
