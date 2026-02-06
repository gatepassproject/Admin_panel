'use client';

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore as db } from '@/lib/firebase';
import { getDepartmentCollectionName, isValidDepartmentCode, type DepartmentCode, getAllDepartmentCodes } from '@/lib/constants/departments';

export interface CurrentUserData {
    uid: string;
    email: string | null;
    full_name: string;
    role: string;
    department?: DepartmentCode;
    department_name?: string;
    designation?: string;
    photoURL?: string;
    phone?: string;
    status?: string;
}

export function useCurrentUser() {
    const [user, setUser] = useState<CurrentUserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const checkUser = async () => {
            try {
                // 1. Try Server-Side API (Most Reliable for Session Cookies)
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    if (data.user && isMounted) {
                        setUser(data.user);
                        setIsLoading(false);
                        return;
                    }
                }
            } catch (err) {
                console.warn('API /auth/me failed, falling back to client SDK', err);
            }

            // 2. Fallback to Client SDK (for basic Auth)
            const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
                if (!firebaseUser) {
                    if (isMounted) {
                        // If API failed AND Auth failed, we are truly logged out
                        setUser(null);
                        setIsLoading(false);
                    }
                    return;
                }

                if (isMounted) {
                    // We have auth, but maybe API failed? Try to assume basic user
                    // or try to fetch from Firestore directly (though API preferred)
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        full_name: firebaseUser.displayName || 'User',
                        role: 'admin',
                    });
                    setIsLoading(false);
                }
            });

            return unsubscribe;
        };

        const unsubPromise = checkUser();

        return () => {
            isMounted = false;
            if (unsubPromise && typeof unsubPromise !== 'undefined' && 'then' in unsubPromise) {
                unsubPromise.then(unsub => unsub && unsub());
            }
        };
    }, []);

    return { user, isLoading, error };
}
