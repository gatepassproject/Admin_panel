'use client';

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore as db } from '@/lib/firebase';
import { getDepartmentCollectionName, isValidDepartmentCode, type DepartmentCode } from '@/lib/constants/departments';

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

        const fetchUserFromSession = async (sessionId: string) => {
            try {
                const userDocRef = doc(db, 'web_admins', sessionId);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists() && isMounted) {
                    const userData = userDoc.data();
                    setUser({
                        uid: sessionId,
                        email: userData.email,
                        full_name: userData.full_name || 'User',
                        role: userData.role || 'admin',
                        department: userData.department as DepartmentCode,
                        department_name: userData.department_name,
                        designation: userData.designation,
                        photoURL: userData.photoURL || undefined,
                        phone: userData.phone,
                        status: userData.status || 'active',
                    });
                }
            } catch (err: any) {
                console.error('Error fetching user from session cookie:', err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        // 1. Check for manual session cookie first (for "Proper Working" bypass)
        const sessionCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('session='));
        const sessionId = sessionCookie?.split('=')[1];

        if (sessionId) {
            fetchUserFromSession(sessionId);
        } else {
            // Only show loader if no manual session to check
            // or we can just let onAuthStateChanged handle it
        }

        // 2. Standard Firebase Auth Sync
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
            if (!firebaseUser) {
                if (!sessionId) {
                    setUser(null);
                    setIsLoading(false);
                }
                return;
            }

            try {
                const userDocRef = doc(db, 'web_admins', firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists() && isMounted) {
                    const userData = userDoc.data();
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        full_name: userData.full_name || firebaseUser.displayName || 'User',
                        role: userData.role || 'admin',
                        department: userData.department as DepartmentCode,
                        department_name: userData.department_name,
                        designation: userData.designation,
                        photoURL: userData.photoURL || firebaseUser.photoURL || undefined,
                        phone: userData.phone,
                        status: userData.status || 'active',
                    });
                } else if (isMounted) {
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        full_name: firebaseUser.displayName || 'User',
                        role: 'admin',
                        photoURL: firebaseUser.photoURL || undefined,
                    });
                }
                setError(null);
            } catch (err: any) {
                if (isMounted) {
                    console.error('Error fetching user auth data:', err);
                    setError(err.message);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    return { user, isLoading, error };
}
