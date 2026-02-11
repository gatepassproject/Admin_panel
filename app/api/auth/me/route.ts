import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session')?.value;
        const userDept = cookieStore.get('user_department')?.value;

        if (!sessionCookie) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        let uid = sessionCookie;
        let email = '';
        let fromAuth = false;

        // Verify if session string is a UID or a real session token
        // For this app's "Direct Login", we often store UID in cookie.
        // But let's check if we can verify it as a decoded token too? 
        // For now, assuming it's the UID as per existing login logic.

        // If we want to be safe, verify against Auth (if it's a token)
        try {
            const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
            uid = decodedToken.uid;
            email = decodedToken.email || '';
            fromAuth = true;
        } catch (e) {
            // Not a session token, treat as raw UID (Development/Legacy mode)
        }

        // Now fetch user data using Admin SDK (Bypasses Rules)

        let userData = null;

        // 1. Priority: Check Web Admin Collections (Role: master_admin, admin)
        // This ensures if a user exists in both (e.g. Faculty in users, Master Admin in web_admins),
        // they get the higher privilege login.
        const collections = ['web_admins'];
        if (userDept && userDept !== 'CAMPUS') {
            collections.unshift(`web_admins_${userDept}`);
        }

        console.log(`[AUTH/ME DEBUG] Checking collections for UID: ${uid}, Dept: ${userDept}`);

        for (const col of collections) {
            const docSnap = await adminDb.collection(col).doc(uid).get();
            if (docSnap.exists) {
                userData = docSnap.data();
                console.log(`[AUTH/ME DEBUG] Found user in: ${col}`);
                break;
            }
        }

        // 2. Fallback: Check Central 'users' collection (Role: faculty, student, etc.)
        if (!userData) {
            const userDoc = await adminDb.collection('users').doc(uid).get();
            if (userDoc.exists) {
                userData = userDoc.data();
                console.log(`[AUTH/ME DEBUG] Found user in: users fallback`);
            }
        }

        if (userData) {
            // Normalize return
            return NextResponse.json({
                user: {
                    uid: uid,
                    email: userData.email || email,
                    full_name: userData.full_name || 'User',
                    role: userData.role || 'admin',
                    department: userData.department,
                    department_name: userData.department_name,
                    designation: userData.designation,
                    photoURL: userData.photoURL,
                    phone: userData.phone,
                    status: userData.status || 'Active'
                }
            });
        }

        // User authenticated but no profile found?
        // Return basic info if we verified via Auth
        if (fromAuth) {
            console.log(`[AUTH/ME DEBUG] No Firestore profile but verified via Firebase Auth`);
            return NextResponse.json({
                user: {
                    uid: uid,
                    email: email,
                    full_name: 'User',
                    role: 'admin'
                }
            });
        }

        console.warn(`[AUTH/ME DEBUG] User with UID ${uid} not found in any collection. Returning 404.`);
        return NextResponse.json({ user: null }, { status: 404 });

    } catch (error: any) {
        console.error('API /auth/me Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
