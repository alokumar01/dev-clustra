
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Crown, LoaderCircle, UsersRound } from "lucide-react";

export function ShowParticipants({
    open,
    onOpenChange,
    allParticipant,
    isLoading = false,
    error = "",
    onRetry,
}) {
    const participants = allParticipant?.participants ?? [];
    const count = allParticipant?.count ?? allParticipant?.countParticipant ?? participants.length;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                showCloseButton={false}
                className="w-95 sm:w-105 p-0"
            >
                {/* Header */}
                <SheetHeader className="px-6 pt-6 pb-5">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <UsersRound className="size-5" />
                        </div>

                        <div>
                            <SheetTitle>
                                Participants
                            </SheetTitle>

                            <SheetDescription>
                                {count} {count === 1 ? "person" : "people"} in this session
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                {/* Participant List */}
                <div className="px-5 pb-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2 rounded-2xl border px-4 py-10 text-sm text-muted-foreground" role="status">
                            <LoaderCircle className="size-4 animate-spin" />
                            Loading participants…
                        </div>
                    ) : error ? (
                        <div className="rounded-2xl border px-4 py-8 text-center">
                            <p className="text-sm text-destructive">{error}</p>
                            <Button type="button" variant="outline" size="sm" className="mt-3" onClick={onRetry}>
                                Try again
                            </Button>
                        </div>
                    ) : participants.length === 0 ? (
                        <div className="rounded-2xl border px-4 py-10 text-center">
                            <UsersRound className="mx-auto mb-3 size-8 text-muted-foreground" />

                            <p className="text-sm font-medium">
                                No participants yet
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1.5">
                            {participants.map((participant) => {
                                const isHost = participant.role === "HOST";

                                const initial =
                                    participant.displayName
                                        ?.charAt(0)
                                        ?.toUpperCase() || "G";

                                return (
                                    <div
                                        key={participant._id}
                                        className="group flex items-center justify-between rounded-xl px-2 py-1 transition-colors"
                                    >
                                        {/* Person */}
                                        <div className="flex min-w-0 items-center gap-3">
                                            {/* Initial */}
                                            <div
                                                className={`relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                                                    isHost
                                                        ? "bg-warning/15 text-foreground"
                                                        : "bg-muted text-muted-foreground"
                                                }`}
                                            >
                                                {initial}

                                                {/* Crown only for host */}
                                                {isHost && (
                                                    <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border-2 border-background bg-warning text-foreground">
                                                        <Crown className="size-2.5 fill-current" />
                                                    </span>
                                                )}
                                            </div>

                                            {/* Name */}
                                            <p className="truncate text-sm font-medium">
                                                {participant.displayName || "Guest"}
                                            </p>
                                        </div>

                                        {/* Host badge only */}
                                        {isHost && (
                                            <div className="flex items-center gap-1.5 rounded-full bg-warning/15 px-2 py-1 text-xs font-medium text-foreground">
                                                <Crown className="size-3 fill-current" />
                                                Host
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
