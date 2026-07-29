import { generateInviteToken } from "@/app/services/invite.service";
import { Check, Copy, Link2, Loader2, MailPlus, RefreshCw, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function InviteView() {
    const [loading, setLoading] = useState(false);
    const [inviteToken, setInviteToken] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleGenerateInvite = async () => {
        setLoading(true);
        setCopied(false);

        try {
            const res = await generateInviteToken();
            setInviteToken(res.data);
            toast.success("Invite link generated successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Unable to generate invite link");
        } finally {
            setLoading(false);
        }
    };

    const handleCopyLink = async () => {
        if (!inviteToken?.fullUrl) {
            return;
        }

        try {
            await navigator.clipboard.writeText(inviteToken.fullUrl);
            setCopied(true);
            toast.success("Invite link copied to clipboard");
        } catch (error) {
            toast.error("Failed to copy invite link");
        }
    };

    return (
        <section className="flex min-h-full items-center justify-center bg-secondary/35 p-4 sm:p-6">
            <div className="w-full max-w-3xl rounded-2xl border border-border bg-background/95 shadow-sm backdrop-blur">
                <div className="border-b border-border/70 p-5 sm:p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                                <MailPlus className="size-5" />
                            </div>
                            <p className="mt-4 text-sm font-medium text-muted-foreground">Private chat invite</p>
                            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                                Invite someone to DevClustra
                            </h1>
                            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                                Create a secure invite link and share it with one person to start a direct conversation.
                            </p>
                        </div>

                        <Button
                            size="lg"
                            className="h-10 w-full gap-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 sm:w-auto cursor-pointer"
                            onClick={handleGenerateInvite}
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : inviteToken ? (
                                <RefreshCw className="size-4" />
                            ) : (
                                <Link2 className="size-4" />
                            )}
                            {loading ? "Generating" : inviteToken ? "Generate new" : "Generate link"}
                        </Button>
                    </div>
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                    <div className="rounded-xl border border-border bg-secondary/35 p-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-background text-blue-600 ring-1 ring-border">
                                <ShieldCheck className="size-4" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="font-medium">Clear and simple sharing</h2>
                                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                    The link opens the invite flow directly. Once accepted, the conversation is created automatically.
                                </p>
                            </div>
                        </div>
                    </div>

                    {!inviteToken ? (
                        <div className="rounded-xl border border-dashed border-border bg-background p-6 text-center">
                            <Link2 className="mx-auto size-8 text-muted-foreground" />
                            <h2 className="mt-4 font-semibold">No invite link yet</h2>
                            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                                Generate a link when you are ready to invite someone into a private chat.
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-border bg-background p-4">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium uppercase text-muted-foreground">Invite link</p>
                                    <a
                                        href={inviteToken.fullUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        title={inviteToken.fullUrl}
                                        className="mt-2 block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap rounded-lg border border-border bg-secondary/50 px-3 py-2 font-mono text-sm text-foreground outline-none transition hover:border-blue-600/40 focus-visible:border-blue-600 focus-visible:ring-3 focus-visible:ring-blue-600/20"
                                    >
                                        {inviteToken.fullUrl}
                                    </a>
                                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                        Long links are shortened on screen, but the full URL is copied.
                                    </p>
                                </div>

                                <Button
                                    variant={copied ? "secondary" : "default"}
                                    size="lg"
                                    className="h-10 w-full gap-2 rounded-xl sm:w-auto cursor-pointer"
                                    onClick={handleCopyLink}
                                >
                                    {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                                    {copied ? "Copied" : "Copy link"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
