'use client';

import { useAuthStore } from '@/store/authStore'
import { useEffect, useState } from 'react';

export default function AuthProvider({ children }) {
    const getMe = useAuthStore((state) => state.getMe);
    const isLoading = useAuthStore((state) => state.isLoading);

    const [ready, setReady] = useState(false);

    useEffect(() => {
        const init = async () => {
            await getMe();   
            setReady(true);
        };

        init();
    }, []);

    //  BLOCK UI until auth is resolved
    if (!ready || isLoading) return null;

    return children;
}