import { generateInviteToken } from "@/app/services/invite.service";
import { Copy, Link2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function InviteView() {
    const [loading, setLoading] = useState(false);
    const [inviteToken, setInviteToken] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleGenerateInvite = async () => {
        setLoading(true);
        setCopied(false);

        try {
            const res = await generateInviteToken();
            console.log("server res from backend:", res)
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
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Invite someone</p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                                Generate an invite link for chat
                            </h1>
                            <CardDescription className="mt-3 text-sm text-slate-600 sm:text-base">
                                Share a one-click invite link with a teammate and start a private conversation instantly.
                            </CardDescription>
                        </div>

                        <Button
                            variant="default"
                            size="lg"
                            className="inline-flex items-center gap-2"
                            onClick={handleGenerateInvite}
                            disabled={loading}
                        >
                            <Link2 className="size-4" />
                            {loading ? "Generating..." : "Generate Invite"}
                        </Button>
                    </div>
                </section>

                <Card className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-white">
                    <CardHeader className="bg-slate-900/95 px-6 py-6">
                        <div className="flex flex-col gap-2">
                            <CardTitle className="text-xl font-semibold text-white">Invite Link</CardTitle>
                            <CardDescription className="text-sm text-slate-300">
                                Generate a secure token-based invite link and copy it with one click.
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="px-6 py-6 sm:px-8">
                        {!inviteToken ? (
                            <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-950/80 p-6 text-center text-slate-300">
                                <p className="text-base leading-7">
                                    Press the button above to create your invite link. It will appear here when ready.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                <div className="min-w-0 flex-1 rounded-3xl bg-slate-900/95 p-4 text-slate-100 ring-1 ring-white/10 sm:p-5">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Your invite URL</p>
                                    <pre className="mt-3 break-after-auto text-sm leading-6 text-slate-100">
                                        {inviteToken.fullUrl}
                                    </pre>
                                </div>
                                <div className="flex flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-end">
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        className="inline-flex items-center justify-center gap-2"
                                        onClick={handleCopyLink}
                                    >
                                        <Copy className="size-4" />
                                        {copied ? "Copied" : "Copy link"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
