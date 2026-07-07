'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function AuthProvider({ children }) {
    const router = useRouter();
    const pathname = usePathname();

    const {
        getMe,
        isAuthenticated,
        isLoading,
    } = useAuthStore();

    const [ready, setReady] = useState(false);

    useEffect(() => {
        const init = async () => {
            await getMe();

            setReady(true);
        };

        init();
    }, []);

    useEffect(() => {
        if (!ready || isLoading) return;

        const protectedRoutes = [
            "/chat",
            "/dashboard",
            "/profile",
            "/settings",
        ];

        const isProtected = protectedRoutes.some(route =>
            pathname.startsWith(route)
        );

        if (!isAuthenticated && isProtected) {
            router.replace(
                `/login?redirect=${encodeURIComponent(pathname)}`
            );
        }
    }, [ready, isLoading, isAuthenticated, pathname, router]);

    if (!ready || isLoading) {
        return null;
    }

    return children;
}
