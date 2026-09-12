import { getPendingAction } from "@/lib/pendingAction";
import { toast } from "sonner";


export default function AuthCheckSession( code ) {
    if (!code) {
        console.warn("AuthCheckSession: Missing required code parameter");
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
