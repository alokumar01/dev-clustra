"use client";
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import React, { use, useEffect, useState } from 'react'
import { acceptInvite, verifyInviteToken } from '@/app/services/invite.service';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function InvitePage({ params }) {
    const { token } = use(params);
    const pathname = usePathname(); // where am I
    const router = useRouter(); // where do i want to go
    const [inviter, setInviter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorState, setErrorState] = useState(null); // Track "USED" or "EXPIRED"

    const {
        getMe,
        isAuthenticated,
        isLoading,
    } = useAuthStore();

    // verify the token and return the inviter details
    useEffect(() => {
        const handleInviteToken = async () => {
            try {
                setLoading(true);
                const res = await verifyInviteToken(token);

                setInviter(res.data);
                setErrorState(null);
            } catch (error) {
                // Read the custom error payload sent by your backend ApiError handler

                const statusCode = error.response?.data?.status;
                const errorCode = error.response?.data?.code; // e.g., "INVITE_TOKEN_USED"

                if (statusCode === 410 || errorCode === "INVITE_TOKEN_USED") {
                    setErrorState("USED")
                    toast.warning(error.response?.data?.message);
                } else {
                    // setErrorState("EXPIRED");
                    toast.error(error.response?.data?.message);
                }
            } finally {
                setLoading(false);
            }
        }

        if (token) {
            handleInviteToken();
        }
    }, [token])

    // after login checks for the details
    useEffect(() => {
        // if (isAuthenticated && token)
        const checkSession = sessionStorage.getItem("token");
        if (token === checkSession && isAuthenticated) {
            toast.success("Welcome back! Completing your invitation...")
            handleAccepetInvite();
            sessionStorage.clear();
            return;
        }
    })

    //handle the accepet invitation
    const handleAccepetInvite = async () => {
        if (!isAuthenticated) {
            sessionStorage.setItem("token", token);
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }

        setLoading(true);
        try {
            const res = await acceptInvite(token)

            const conversationId = res.conversationId;
            if (conversationId) {
                router.push(`/chat?conversationId=${conversationId}`);
            } else {
                console.log("No Conversation ID is returned from server");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    }

    // 1. Loading UI State
    if (loading) return <p className="text-center p-10"> <Spinner /> </p>

    // 2. Already Used Link UI State
    if (errorState === "USED") {
        return (
            <Card className="p-10 text-center border-amber-500">
                <p className='text-xl font-bold text-amber-600'>Link Already Used </p>
                <p className='text-gray-500 mt-2'>This 1-to-1 invitation link has already been accepted by someone else.</p>
            </Card>
        )
    }

    // 3. Expired or Invalid Link UI State
    if (errorState === "EXPIRED" || !inviter) {
        return (
            <Card className="p-10 text-center border-destructive">
                <p className='text-xl font-bold text-destructive'>Invitation Invalid </p>
                <p className='text-gray-500 mt-2'>This link is broken or has expired after its 3-day window.</p>
            </Card>
        )
    }

    // 4. Success State (Invite Card is active and pending)
    return (
        <Card className="p-10 max-w-md mx-auto mt-10 shadow-lg text-center">
            {inviter.avatar && (
                <div className="flex justify-center mb-4">
                    <Image
                        src={inviter.avatar}
                        alt="Avatar"
                        width={96}
                        height={96}
                        className='rounded-full bg-sky-400 border-2 border-white shadow-md'
                    />
                </div>
            )}
            {/* <p> The current path is: {pathname} </p> */}
            <h2 className='text-2xl font-semibold mb-2'>You are invited!</h2>
            <p className='text-gray-600 mb-6'>
                <strong>@{inviter.username}</strong> has invited you to join their chat room.
            </p>

            <Button className="w-full bg-sky-500 hover:bg-sky-600 cursor-pointer text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                onClick={() => handleAccepetInvite()}
            >
                Accept & Join Chat
            </Button>

            {}
        </Card>
    )
}
