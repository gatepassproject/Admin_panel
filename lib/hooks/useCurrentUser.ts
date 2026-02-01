'use client';

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase-client';
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
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
            if (!firebaseUser) {
                setUser(null);
                setIsLoading(false);
                return;
            }

            try {
                // Get department from cookie
                const departmentCookie = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('user_department='));
                const department = departmentCookie?.split('=')[1] as DepartmentCode | undefined;

                // If no department in cookie, try to fetch from base collection (backward compatibility)
                let collectionName = 'web_admins';
                if (department && isValidDepartmentCode(department)) {
                    collectionName = getDepartmentCollectionName('web_admins', department);
                }

                // Fetch user profile from department-scoped collection (Project 2)
                const userDocRef = doc(db, collectionName, firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
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
                } else {
                    // Fallback to Firebase Auth data if Firestore document doesn't exist
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
                console.error('Error fetching user data:', err);
                setError(err.message);
                // Fallback to basic Firebase Auth data
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    full_name: firebaseUser.displayName || 'User',
                    role: 'admin',
                });
            } finally {
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return { user, isLoading, error };
}
