import { getPendingAction } from "@/lib/pendingAction";
export default function AuthCheckSession( code ) {
    if (!code) {
        return null;
    }

    const pendingAction = getPendingAction();

    if (!pendingAction) {
        return null;
    }

    const storedSessionCode = pendingAction?.payload?.sessionCode;

    if (!storedSessionCode) {
        return null;
    }

    if (storedSessionCode !== code) {
        return null;
    }


    return pendingAction;
}
