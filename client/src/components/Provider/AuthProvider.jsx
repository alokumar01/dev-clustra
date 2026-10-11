'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Spinner } from '@/components/ui/spinner';
import AppLoadingScreen from '../AppLoadingScreen';

export default function AuthProvider({ children }) {
    const getMe = useAuthStore((state) => state.getMe);
    const isLoading = useAuthStore((state) => state.isLoading);

    const [ready, setReady] = useState(false);

    useEffect(() => {
        let isMounted = true;

        getMe().finally(() => {
            if (isMounted) setReady(true);
        });

        return () => {
            isMounted = false;
        };
    }, [getMe]);

    if (!ready || isLoading) {
        return <AppLoadingScreen />
    }

    return children;
}
