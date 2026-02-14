import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session')?.value;
        const userDept = cookieStore.get('user_department')?.value;
        const userRole = cookieStore.get('user_role')?.value;

        if (!sessionCookie) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        let uid = sessionCookie;
        let email = '';
        let fromAuth = false;

        try {
            const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
            uid = decodedToken.uid;
            email = decodedToken.email || '';
            fromAuth = true;
        } catch (e) {
            // Not a Firebase session token; treat as raw UID from direct login.
        }

        let userData: any = null;

        // 1) Priority: web admin collections
        const adminCollections = ['web_admins'];
        if (userDept && userDept !== 'CAMPUS') {
            adminCollections.unshift(`web_admins_${userDept}`);
        }

        console.log(`[AUTH/ME] Resolving UID: ${uid}, Dept: ${userDept}, Role cookie: ${userRole || 'n/a'}`);

        for (const col of adminCollections) {
            const docSnap = await adminDb.collection(col).doc(uid).get();
            if (docSnap.exists) {
                userData = docSnap.data();
                console.log(`[AUTH/ME] Found profile in ${col}`);
                break;
            }
        }

        // 2) Role-based collection fallback (covers admission/security direct logins)
        if (!userData) {
            const roleMap: Record<string, string> = {
                admission: 'app_admission',
                security: 'app_security'
            };

            const mappedCollection = userRole ? roleMap[userRole] : undefined;
            if (mappedCollection) {
                const docSnap = await adminDb.collection(mappedCollection).doc(uid).get();
                if (docSnap.exists) {
                    userData = docSnap.data();
                    console.log(`[AUTH/ME] Found profile in ${mappedCollection} via role cookie`);
                }
            }
        }

        // 3) Exhaustive fallback in app collections
        if (!userData) {
            const fallbackCollections = ['app_admission', 'app_security', 'users'];
            for (const col of fallbackCollections) {
                const docSnap = await adminDb.collection(col).doc(uid).get();
                if (docSnap.exists) {
                    userData = docSnap.data();
                    console.log(`[AUTH/ME] Found profile in fallback collection: ${col}`);
                    break;
                }
            }
        }

        if (userData) {
            return NextResponse.json({
                user: {
                    uid: uid,
                    email: userData.email || userData.official_email || userData.username || email,
                    full_name: userData.full_name || userData.username || 'User',
                    role: userData.role || userRole || 'admin',
                    department: userData.department,
                    department_name: userData.department_name,
                    designation: userData.designation,
                    photoURL: userData.photoURL,
                    phone: userData.phone,
                    status: userData.status || 'Active'
                }
            });
        }

        if (fromAuth) {
            console.log('[AUTH/ME] No Firestore profile, but Firebase session is valid');
            return NextResponse.json({
                user: {
                    uid: uid,
                    email: email,
                    full_name: 'User',
                    role: userRole || 'admin'
                }
            });
        }

        console.warn(`[AUTH/ME] UID ${uid} not found in known collections`);
        return NextResponse.json({ user: null }, { status: 404 });
    } catch (error: any) {
        console.error('[AUTH/ME] API error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
