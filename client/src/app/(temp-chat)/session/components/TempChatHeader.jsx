import { GetAllParticipants } from "@/app/services/service.session";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { clearPendingAction } from "@/lib/pendingAction";
import { sessionSocket } from "@/store/socketStore";
import { ArrowLeft, Copy, UsersRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ShowParticipants } from "./ShowParticipants";

export function TempChatHeader({
    user,
    sessionCode,
    participantName,
    expiresAt,
    avatar,
}) {
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();
    const [allParticipant, setAllParticipant] = useState([]);


    async function copyCode() {
        if (!sessionCode || !navigator?.clipboard) return;
        await navigator.clipboard.writeText(sessionCode);
        toast.success("Session code copied to clipboard");
    }

    // SESSION CLOSED EVENT
    useEffect(() => {
        const handleSessionClosed = () => {
            toast.warning("Session is closed by host...");
            clearPendingAction();
            router.push("/session");
        };

        sessionSocket.on("session:closed", handleSessionClosed);

        return () => {
            sessionSocket.off("session:closed", handleSessionClosed);
        };
    }, [router]);


    // CLOSE SESSION VIA SOCKET EVENT
    function closeSession(event) {
        event?.preventDefault();

        sessionSocket.emit("session:close", {
            code: sessionCode
        }, (response) => {
            console.log("[SESSION CLOSE] ACK FROM SERVER: ", response);
        })
    }

    // LEAVE SESSION VIA SOCKET EVENT
    function leaveSession(event) {
        event?.preventDefault();

        sessionSocket.emit("session:leave", {}, (response) => {
            console.log("[SESSION LEAVE] ACK FROM SERVER: ", response);

            // response is ok then clear token and redirect to /sesison

            if (!response?.success) {
                toast.error(response?.message || "Unable to leave the session.")
                return;
            }

            clearPendingAction();

            //leave the chat
            router.push("/session");
        });

        
    }


    // FETCH PARTICIPANTS
    const FetchAllParticipants = async () => {
        try {
            const response = await GetAllParticipants(sessionCode);

            setAllParticipant(response?.data ?? {
                count: 0,
                participants: [],
            });
        } catch (error) {
            console.error("[FETCH PARTICIPANTS] ERROR:", error);

            setAllParticipant({
                count: 0,
                participants: [],
            });
        }
    };


return (
    <header className="border-b border-zinc-200 bg-white px-3 py-3 sm:px-5 dark:border-white/10 dark:bg-zinc-950">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
                <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="size-9 rounded-lg"
                >
                    <Link href="/session" aria-label="Back to sessions">
                        <ArrowLeft className="size-5" />
                    </Link>
                </Button>

                <Avatar className="size-10">
                    <AvatarImage src={avatar} alt={`${participantName} avatar`} />
                    {/* <AvatarFallback className="bg-blue-50 text-blue-700 dark:bg-white/10 dark:text-white">
              {getInitial(participantName)}
            </AvatarFallback> */}
                </Avatar>

                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h1 className="truncate text-base font-semibold text-zinc-950 dark:text-white">
                            Temp Chat
                        </h1>
                        <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-500/10 dark:text-green-300">
                            <span className="size-1.5 rounded-full bg-green-500" />
                            Active
                        </span>
                    </div>
                    <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                        {participantName}
                        {expiresAt ? ` · ${expiresAt}` : ""}
                    </p>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    className="hidden h-9 rounded-lg border-zinc-200 cursor-pointer bg-white font-mono text-xs dark:border-white/10 dark:bg-zinc-950 sm:inline-flex"
                    onClick={copyCode}
                >
                    <Copy className="size-3.5" />
                    {sessionCode}
                </Button>

                <span className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                    <Button
                        type="button"
                        onClick={async () => {
                            setIsVisible(true);
                            await FetchAllParticipants();
                        }}

                        className="cursor-pointer"
                    >
                        <UsersRound className="size-4" />
                        Participants
                    </Button>
                </span>
                <ShowParticipants open={isVisible} onOpenChange={setIsVisible} allParticipant={allParticipant} />

                {/* close or leave based on owner */}
                {user?.role === "HOST" ? (
                    <Button
                        onClick={() => closeSession()}
                        className="cursor-pointer"
                    >
                        Close Session
                    </Button>
                ) : (
                    <Button variant="destructive"
                        className="cursor-pointer"
                        onClick={() => leaveSession()}
                    >
                        Leave Session
                    </Button>
                )}

            </div>
        </div>
    </header>
);
}

function getInitial(name) {
    return name?.trim()?.[0]?.toUpperCase() || "G";
}
