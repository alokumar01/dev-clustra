"use client";

import { ArrowRight, CircleAlert, Loader2Icon, RefreshCw, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { acceptInvite, verifyInviteToken } from '@/app/services/invite.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { savePendingAction, clearPendingAction, getPendingAction } from '@/lib/pendingAction';
import { logger } from '@/lib/logger';

export default function InvitePage({ params }) {
    const { token } = use(params);
    const router = useRouter();

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const [inviter, setInviter] = useState(null);
    const [status, setStatus] = useState('verifying');
    const [errorMessage, setErrorMessage] = useState('');
    const [isAccepting, setIsAccepting] = useState(false);
    const [joinedConversationId, setJoinedConversationId] = useState(null);
    const [verificationAttempt, setVerificationAttempt] = useState(0);
    const autoJoinAttempted = useRef(false);

    const handleAcceptInvite = useCallback(async () => {
        if (!token) {
            setStatus('invalid');
            setErrorMessage('This invitation link is missing a valid token.');
            toast.error('This invitation link is missing a valid token.');
            return;
        }

        if (!isAuthenticated) {
            savePendingAction({
                type: "JOIN_INVITE",
                payload: {
                    token,
                }
            })
            toast.info('Please sign in to continue.');
            router.push(`/login?redirect=${encodeURIComponent(`/invite/${token}`)}`);
            return;
        }

        setIsAccepting(true);
        try {
            const response = await acceptInvite(token);
            const conversationId = response?.conversationId;
            clearInvitePendingAction(token);
            setJoinedConversationId(conversationId || null);
            setStatus('joined');
            if (!conversationId) {
                logger.warn('invite.accepted_without_conversation', {
                    area: 'invite',
                    operation: 'accept',
                });
            }
            toast.success('Invite accepted. Your conversation is ready.');
        } catch (error) {
            const message = error?.response?.data?.message || 'Unable to accept this invitation right now.';
            const errorCode = error?.response?.data?.code;
            const httpStatus = error?.response?.status;
            if (errorCode === 'INVITE_TOKEN_EXPIRED' || errorCode === 'INVITE_TOKEN_USED' || errorCode === 'INVITE_MISSING') {
                setStatus(errorCode === 'INVITE_TOKEN_EXPIRED' ? 'expired' : 'used');
                setErrorMessage(errorCode === 'INVITE_MISSING'
                    ? 'This invite may already have been accepted or is no longer active. Ask the sender for a fresh link if you still need access.'
                    : message);
                clearInvitePendingAction(token);
            } else if (httpStatus === 401 || httpStatus === 403 || errorCode === 'INVITE_LINK_UNAUTHORIZED') {
                setStatus('unauthorized');
                setErrorMessage('Sign in with an account that can accept this invitation, then try again.');
            } else {
                setStatus('join-error');
                setErrorMessage(message);
            }
            logger.warn('invite.accept.failed', {
                area: 'invite',
                operation: 'accept',
                status: httpStatus,
                code: errorCode,
            });
            toast.error(message);
        } finally {
            setIsAccepting(false);
        }
    }, [isAuthenticated, router, token]);

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
                    clearInvitePendingAction(token);
                }
            } catch (error) {
                if (!isMounted) return;

                const statusCode = error?.response?.status;
                const errorCode = error?.response?.data?.code;
                const message = error?.response?.data?.message || 'This invitation could not be verified.';

                if (statusCode === 410 || errorCode === 'INVITE_TOKEN_USED') {
                    setStatus('used');
                    setErrorMessage(message);
                    clearInvitePendingAction(token);
                    toast.warning(message);
                } else if (statusCode === 401 || statusCode === 403 || errorCode === 'INVITE_LINK_UNAUTHORIZED') {
                    setStatus('unauthorized');
                    setErrorMessage('This invitation needs an authorized account. Sign in and try again.');
                } else if (errorCode === 'INVITE_TOKEN_EXPIRED') {
                    setStatus('expired');
                    setErrorMessage('This invitation has expired. Ask the sender to generate a new link.');
                    clearInvitePendingAction(token);
                } else if (!error.response || statusCode >= 500) {
                    setStatus('verification-error');
                    setErrorMessage('We could not reach the invite service. Check your connection and try again.');
                } else {
                    setStatus('invalid');
                    setErrorMessage(errorCode === 'INVITE_MISSING'
                        ? 'This invitation link is invalid or no longer available.'
                        : message);
                    if (statusCode === 404 || statusCode === 400) clearInvitePendingAction(token);
                    toast.error(message);
                }

                logger.warn('invite.verification.failed', {
                    area: 'invite',
                    operation: 'verify',
                    status: error.response?.status,
                    code: errorCode,
                });
            }

            function clearInvitePendingAction(token) {
                const pendingAction = getPendingAction();
                if (pendingAction?.type === 'JOIN_INVITE' && pendingAction.payload?.token === token) {
                    clearPendingAction();
                }
            }
        };

        verifyInvite();

        return () => {
            isMounted = false;
        };
    }, [token, verificationAttempt]);

    useEffect(() => {
        const pendingAction = getPendingAction();

        if (
            pendingAction &&
            pendingAction.type === "JOIN_INVITE" &&
            pendingAction.payload.token === token &&
            isAuthenticated &&
            status === 'ready' &&
            !autoJoinAttempted.current
        ) {
            autoJoinAttempted.current = true;
            toast.success('Welcome back! Completing your invitation...');
            handleAcceptInvite();
        }
    }, [handleAcceptInvite, isAuthenticated, status, token]);

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

        if (status === 'joined') {
            return (
                <Card className="w-full max-w-xl border-emerald-500/30 bg-card/90 shadow-[0_25px_80px_-30px_rgba(15,23,42,0.45)] backdrop-blur">
                    <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center sm:px-10">
                        <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                            <ShieldCheck className="size-7" />
                        </div>
                        <div className="space-y-2">
                            <CardTitle className="text-xl">You’re in</CardTitle>
                            <CardDescription>Your invitation was accepted. The private conversation is ready.</CardDescription>
                        </div>
                        <Button onClick={() => router.push(joinedConversationId ? `/chat?conversationId=${joinedConversationId}` : '/chat')} className="w-full sm:w-auto">
                            Open conversation
                            <ArrowRight className="size-4" />
                        </Button>
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
                            <CardTitle className="text-xl">This invite was already used or is no longer active</CardTitle>
                            <CardDescription>{errorMessage || 'It may already have been accepted. Ask the sender for a fresh invitation if you still need to join.'}</CardDescription>
                        </div>
                        <Button onClick={() => router.push('/chat')} className="w-full sm:w-auto">
                            Open your chats
                        </Button>
                        <Button variant="outline" onClick={() => router.push('/')} className="w-full sm:w-auto">
                            Back to home
                        </Button>
                    </CardContent>
                </Card>
            );
        }

        if (status === 'expired') {
            return (
                <Card className="w-full max-w-xl border-amber-400/50 bg-card/90 shadow-[0_25px_80px_-30px_rgba(15,23,42,0.45)] backdrop-blur">
                    <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center sm:px-10">
                        <div className="flex size-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
                            <CircleAlert className="size-7" />
                        </div>
                        <div className="space-y-2">
                            <CardTitle className="text-xl">This invite has expired</CardTitle>
                            <CardDescription>{errorMessage || 'Ask the sender to generate and share a new invite link.'}</CardDescription>
                        </div>
                        <Button onClick={() => router.push('/')} className="w-full sm:w-auto">Back to home</Button>
                    </CardContent>
                </Card>
            );
        }

        if (status === 'unauthorized') {
            return (
                <Card className="w-full max-w-xl border-border/70 bg-card/90 shadow-[0_25px_80px_-30px_rgba(15,23,42,0.45)] backdrop-blur">
                    <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center sm:px-10">
                        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <ShieldCheck className="size-7" />
                        </div>
                        <div className="space-y-2">
                            <CardTitle className="text-xl">Sign in to join this conversation</CardTitle>
                            <CardDescription>{errorMessage || 'Your invite will be saved so you can continue after signing in.'}</CardDescription>
                        </div>
                        <Button onClick={() => {
                            savePendingAction({ type: 'JOIN_INVITE', payload: { token } });
                            router.push(`/login?redirect=${encodeURIComponent(`/invite/${token}`)}`);
                        }} className="w-full sm:w-auto">Sign in to continue</Button>
                    </CardContent>
                </Card>
            );
        }

        if (status === 'verification-error' || status === 'join-error') {
            return (
                <Card className="w-full max-w-xl border-destructive/30 bg-card/90 shadow-[0_25px_80px_-30px_rgba(15,23,42,0.45)] backdrop-blur">
                    <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center sm:px-10">
                        <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <CircleAlert className="size-7" />
                        </div>
                        <div className="space-y-2">
                            <CardTitle className="text-xl">{status === 'join-error' ? 'Could not join yet' : 'Could not verify this invite'}</CardTitle>
                            <CardDescription>{errorMessage}</CardDescription>
                        </div>
                        {status === 'join-error' ? (
                            <Button onClick={handleAcceptInvite} disabled={isAccepting} className="w-full sm:w-auto">
                                {isAccepting ? <Loader2Icon className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                                Try joining again
                            </Button>
                        ) : (
                            <Button onClick={() => {
                                setStatus('verifying');
                                setVerificationAttempt((attempt) => attempt + 1);
                            }} className="w-full sm:w-auto">
                                <RefreshCw className="size-4" />
                                Try again
                            </Button>
                        )}
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
                            <CardDescription>{errorMessage || 'This link appears to be broken. Please request a new one.'}</CardDescription>
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
