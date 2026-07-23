"use client";

import { ArrowRight, CircleAlert, Loader2Icon, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { acceptInvite, verifyInviteToken } from '@/app/services/invite.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';

export default function InvitePage({ params }) {
    const { token } = use(params);
    const pathname = usePathname();
    const router = useRouter();

    const { isAuthenticated } = useAuthStore();
    const [inviter, setInviter] = useState(null);
    const [status, setStatus] = useState('verifying');
    const [errorMessage, setErrorMessage] = useState('');
    const [isAccepting, setIsAccepting] = useState(false);

    const handleAcceptInvite = async () => {
        if (!token) {
            setStatus('invalid');
            setErrorMessage('This invitation link is missing a valid token.');
            toast.error('This invitation link is missing a valid token.');
            return;
        }

        if (!isAuthenticated) {
            console.info('[invite] Redirecting unauthenticated user to sign in', { token, pathname });
            sessionStorage.setItem('inviteToken', token);
            toast.info('Please sign in to continue.');
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }

        setIsAccepting(true);
        try {
            console.info('[invite] Accepting invite request', { token });
            const response = await acceptInvite(token);
            const conversationId = response?.conversationId;

            if (conversationId) {
                console.info('[invite] Invite accepted successfully', { token, conversationId });
                toast.success('Invite accepted. Opening your chat now.');
                router.push(`/chat?conversationId=${conversationId}`);
            } else {
                console.warn('[invite] Invite accepted without a conversation ID', { token, response });
                toast.success('Invite accepted. You can open your chats from the dashboard.');
                router.push('/chat');
            }
        } catch (error) {
            const message = error?.response?.data?.message || 'Unable to accept this invitation right now.';
            console.error('[invite] Failed to accept invite', { token, error: message });
            toast.error(message);
        } finally {
            setIsAccepting(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const verifyInvite = async () => {
            if (!token) {
                if (!isMounted) return;
                setStatus('invalid');
                setErrorMessage('This invitation link is missing a valid token.');
                toast.error('This invitation link is missing a valid token.');
                return;
            }

            console.info('[invite] Verifying invite token', { token, pathname });
            try {
                setStatus('verifying');
                const response = await verifyInviteToken(token);

                if (!isMounted) return;

                if (response?.data) {
                    setInviter(response.data);
                    setStatus('ready');
                    setErrorMessage('');
                } else {
                    setStatus('invalid');
                    setErrorMessage('This invitation link is no longer valid.');
                }
            } catch (error) {
                if (!isMounted) return;

                const statusCode = error?.response?.data?.status;
                const errorCode = error?.response?.data?.code;
                const message = error?.response?.data?.message || 'This invitation could not be verified.';

                if (statusCode === 410 || errorCode === 'INVITE_TOKEN_USED') {
                    setStatus('used');
                    setErrorMessage(message);
                    toast.warning(message);
                } else {
                    setStatus('invalid');
                    setErrorMessage(message);
                    toast.error(message);
                }

                console.error('[invite] Invite verification failed', { token, error: message });
            }
        };

        verifyInvite();

        return () => {
            isMounted = false;
        };
    }, [pathname, token]);

    useEffect(() => {
        const pendingToken = sessionStorage.getItem('inviteToken');

        if (pendingToken && pendingToken === token && isAuthenticated) {
            console.info('[invite] Session restored. Finishing invite acceptance', { token });
            sessionStorage.removeItem('inviteToken');
            toast.success('Welcome back! Completing your invitation...');
            handleAcceptInvite();
        }
    }, [isAuthenticated, token]);

    const renderState = () => {
        if (status === 'verifying') {
            return (
                <Card className="w-full max-w-xl border-border/70 bg-card/90 shadow-[0_25px_80px_-30px_rgba(15,23,42,0.45)] backdrop-blur">
                    <CardContent className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center sm:px-10">
                        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Loader2Icon className="size-7 animate-spin" />
                        </div>
                        <div className="space-y-2">
                            <CardTitle className="text-xl">Checking your invitation</CardTitle>
                            <CardDescription>We&apos;re validating the link and preparing your next step.</CardDescription>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        if (status === 'used') {
            return (
                <Card className="w-full max-w-xl border-amber-400/50 bg-card/90 shadow-[0_25px_80px_-30px_rgba(15,23,42,0.45)] backdrop-blur">
                    <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center sm:px-10">
                        <div className="flex size-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
                            <CircleAlert className="size-7" />
                        </div>
                        <div className="space-y-2">
                            <CardTitle className="text-xl">This invite has already been used</CardTitle>
                            <CardDescription>This link is no longer active. Ask the sender for a fresh invitation if you still need access.</CardDescription>
                        </div>
                        <Button onClick={() => router.push('/')} className="w-full sm:w-auto">
                            Back to home
                        </Button>
                    </CardContent>
                </Card>
            );
        }

        if (status === 'invalid' || !inviter) {
            return (
                <Card className="w-full max-w-xl border-destructive/40 bg-card/90 shadow-[0_25px_80px_-30px_rgba(15,23,42,0.45)] backdrop-blur">
                    <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center sm:px-10">
                        <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <CircleAlert className="size-7" />
                        </div>
                        <div className="space-y-2">
                            <CardTitle className="text-xl">Invitation unavailable</CardTitle>
                            <CardDescription>{errorMessage || 'This link appears to be broken or expired. Please request a new one.'}</CardDescription>
                        </div>
                        <Button onClick={() => router.push('/')} className="w-full sm:w-auto">
                            Back to home
                        </Button>
                    </CardContent>
                </Card>
            );
        }

        return (
            <Card className="w-full max-w-xl overflow-hidden border-border/70 bg-card/90 shadow-[0_25px_80px_-30px_rgba(15,23,42,0.45)] backdrop-blur">
                <CardHeader className="px-6 pb-2 pt-6 sm:px-8">
                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        <Sparkles className="size-4" />
                        <span>Private chat invite</span>
                    </div>
                    <CardTitle className="text-2xl sm:text-3xl">You&apos;ve been invited</CardTitle>
                    <CardDescription className="max-w-md text-base">
                        {inviter?.username ? `@${inviter.username}` : 'A teammate'} has invited you to join a secure conversation.
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-6 px-6 pb-6 sm:px-8">
                    <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/70 bg-background/70 p-6 text-center">
                        <div className="flex size-20 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-primary/10 text-primary shadow-sm">
                            {inviter?.avatar ? (
                                <img
                                    src={inviter.avatar}
                                    alt={`${inviter.username || 'Invite sender'} avatar`}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <UserRound className="size-9" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <p className="text-lg font-semibold">{inviter?.username ? `@${inviter.username}` : 'Your contact'}</p>
                            <p className="text-sm text-muted-foreground">One tap and you’ll be inside the conversation.</p>
                        </div>
                    </div>

                    <div className="grid gap-3 rounded-2xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground sm:grid-cols-2">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="size-4 text-primary" />
                            Secure private chat access
                        </div>
                        <div className="flex items-center gap-2">
                            <ArrowRight className="size-4 text-primary" />
                            Quick join in seconds
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button onClick={handleAcceptInvite} disabled={isAccepting} className="w-full sm:w-auto">
                            {isAccepting ? 'Joining chat...' : 'Accept & join chat'}
                        </Button>
                        <Button variant="outline" onClick={() => router.push('/')} className="w-full sm:w-auto">
                            Back to home
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center">
                {renderState()}
            </div>
        </main>
    );
}
