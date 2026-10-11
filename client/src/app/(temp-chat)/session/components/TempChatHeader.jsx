import { getAllParticipants } from "@/app/services/session.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { clearPendingAction } from "@/lib/pendingAction";
import { sessionSocket } from "@/store/socketStore";
import { AlertCircle, ArrowLeft, Check, Copy, LoaderCircle, UsersRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { ShowParticipants } from "./ShowParticipants";

export function TempChatHeader({
    user,
    sessionCode,
    participantName,
    expiresAt,
    now,
    avatar,
    isEnded,
    endedReason,
    onSessionEnded,
}) {
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();
    const [allParticipant, setAllParticipant] = useState({
        count: 1,
        participants: user ? [user] : [],
    });
    const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);
    const [participantsError, setParticipantsError] = useState("");
    const [isBusy, setIsBusy] = useState(false);
    const [copied, setCopied] = useState(false);
    const remaining = now > 0 && Number.isFinite(expiresAt) ? Math.max(0, expiresAt - now) : null;
    const isExpired = remaining === 0;
    const statusLabel = isEnded || isExpired ? (isExpired || endedReason === "expired" ? "Expired" : "Ended") : "Temporary";
    const expiryPercent = remaining === null ? null : Math.min(100, Math.max(0, (remaining / (24 * 60 * 60 * 1000)) * 100));

    useEffect(() => {
        const handleJoined = ({ participant }) => {
            if (!participant?._id) return;
            setAllParticipant((current) => {
                if (current.participants.some((item) => item._id?.toString() === participant._id.toString())) {
                    return current;
                }
                const participants = [...current.participants, participant];
                return { participants, count: participants.length };
            });
        };
        const handleLeft = ({ participant }) => {
            if (!participant?._id) return;
            setAllParticipant((current) => {
                const participants = current.participants.filter(
                    (item) => item._id?.toString() !== participant._id.toString(),
                );
                return { participants, count: participants.length };
            });
        };
        sessionSocket.on("session:participant-joined", handleJoined);
        sessionSocket.on("session:participant-left", handleLeft);
        return () => {
            sessionSocket.off("session:participant-joined", handleJoined);
            sessionSocket.off("session:participant-left", handleLeft);
        };
    }, []);

    async function copyCode() {
        if (!sessionCode) return;
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/session/${sessionCode}`);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
            toast.success("Session invite link copied");
        } catch {
            toast.error("Could not copy the invite link. Please copy the session code manually.");
        }
    }

    function closeSession(event) {
        event?.preventDefault();
        if (isBusy || isEnded || isExpired) return;
        setIsBusy(true);

        sessionSocket.timeout(8000).emit("session:close", { code: sessionCode }, (error, response) => {
            if (error || !response?.success) {
                logger.warn("session.close.failed", {
                    area: "session_socket",
                    operation: "close_session",
                    code: response?.code || error?.message,
                });
                toast.error(response?.message || "Unable to close the session. Check your connection and try again.");
                setIsBusy(false);
                return;
            }

            toast.success(response.message || "Session closed successfully.");
            onSessionEnded?.("closed");
            setIsBusy(false);
        });
    }

    function leaveSession(event) {
        event?.preventDefault();
        if (isBusy) return;
        setIsBusy(true);

        sessionSocket.timeout(8000).emit("session:leave", {}, (error, response) => {
            if (error || !response?.success) {
                logger.warn("session.leave.failed", {
                    area: "session_socket",
                    operation: "leave_session",
                    code: response?.code || error?.message,
                });
                toast.error(response?.message || "Unable to leave the session. Check your connection and try again.");
                setIsBusy(false);
                return;
            }

            clearPendingAction();
            router.push("/session");
        });
    }

    async function fetchParticipants() {
        setIsLoadingParticipants(true);
        setParticipantsError("");
        try {
            const response = await getAllParticipants(sessionCode);
            const participants = response?.data?.participants ?? [];
            setAllParticipant({
                count: response?.data?.countParticipant ?? participants.length,
                participants,
            });
        } catch (error) {
            logger.warn("session.participants.load_failed", {
                area: "session",
                operation: "fetch_participants",
                status: error.response?.status,
                code: error.code,
            });
            setParticipantsError("Could not load participants. Try again.");
        } finally {
            setIsLoadingParticipants(false);
        }
    }

    return (
        <header className="relative shrink-0 border-b border-border bg-card px-3 py-3 sm:px-5">
            <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <Button asChild variant="ghost" size="icon" className="size-9 shrink-0 rounded-lg">
                        <Link href="/session" aria-label="Back to sessions">
                            <ArrowLeft className="size-5" />
                        </Link>
                    </Button>

                    <Avatar className="size-10 shrink-0">
                        <AvatarImage src={avatar} alt={`${participantName} avatar`} />
                        <AvatarFallback>{getInitial(participantName)}</AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="truncate text-base font-semibold text-foreground">
                                Temporary chat
                            </h1>
                            <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${isEnded || isExpired ? "bg-warning/15 text-foreground" : "bg-success/10 text-success"}`}>
                                {isEnded || isExpired ? <AlertCircle className="size-3" aria-hidden="true" /> : <span className="size-1.5 rounded-full bg-success motion-safe:animate-pulse motion-reduce:animate-none" />}
                                {statusLabel}
                            </span>
                        </div>
                        <p className="truncate text-xs text-muted-foreground sm:text-sm">
                            {participantName} · {isEnded || isExpired
                                ? (isExpired || endedReason === "expired" ? "Session expired" : "Session ended")
                                : remaining === null ? "Expiry unavailable" : `Expires in ${formatRemaining(remaining)}`}
                        </p>
                    </div>
                </div>

                <div className="flex w-full min-w-0 items-center justify-end gap-1.5 sm:w-auto sm:gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-9 min-w-0 flex-1 rounded-xl bg-background px-2 font-mono text-xs sm:flex-initial sm:px-3"
                        onClick={copyCode}
                        disabled={isEnded || isExpired}
                        aria-label="Copy temporary session invite link"
                        title="Copy invite link"
                    >
                        {copied ? <Check className="size-3.5 shrink-0" /> : <Copy className="size-3.5 shrink-0" />}
                        <span className="truncate">{copied ? "Copied" : sessionCode}</span>
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className="h-9 shrink-0 px-2 sm:px-3"
                        onClick={async () => {
                            setIsVisible(true);
                            await fetchParticipants();
                        }}
                        aria-label="Show session participants"
                    >
                        <UsersRound className="size-4" />
                        <span className="hidden sm:inline">Participants</span>
                        {allParticipant.count > 0 && <span>{allParticipant.count}</span>}
                    </Button>

                    {user?.role === "HOST" ? (
                        <Button
                            type="button"
                            onClick={closeSession}
                            disabled={isBusy || isEnded || isExpired}
                            className="h-9 shrink-0 px-2 text-xs sm:px-3 sm:text-sm"
                        >
                            {isBusy ? <LoaderCircle className="size-4 animate-spin" /> : null}
                            <span className="hidden sm:inline">{isBusy ? "Closing" : "Close session"}</span>
                            <span className="sm:hidden">{isBusy ? "Closing" : "Close"}</span>
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant="destructive"
                            className="h-9 shrink-0 px-2 text-xs sm:px-3 sm:text-sm"
                            disabled={isBusy}
                            onClick={leaveSession}
                        >
                            {isBusy ? <LoaderCircle className="size-4 animate-spin" /> : null}
                            {isBusy ? "Leaving" : "Leave"}
                        </Button>
                    )}
                </div>
            </div>

            <ShowParticipants
                open={isVisible}
                onOpenChange={setIsVisible}
                allParticipant={allParticipant}
                isLoading={isLoadingParticipants}
                error={participantsError}
                onRetry={fetchParticipants}
            />
            {!isEnded && expiryPercent !== null && (
                <div
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-primary/10"
                    role="progressbar"
                    aria-label="Time remaining in this temporary session"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(expiryPercent)}
                >
                    <div
                        className="h-full bg-primary transition-[width] duration-1000 ease-linear motion-reduce:transition-none"
                        style={{ width: `${expiryPercent}%` }}
                    />
                </div>
            )}
        </header>
    );
}

function formatRemaining(milliseconds) {
    const totalMinutes = Math.ceil(milliseconds / 60_000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    if (days) return `${days}d ${hours}h`;
    if (hours) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

function getInitial(name) {
    return name?.trim()?.[0]?.toUpperCase() || "G";
}
