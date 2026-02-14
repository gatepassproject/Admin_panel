import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
    try {
        const { email, password, department } = await request.json();

        if (!email || !password || !department) {
            return NextResponse.json(
                { error: 'Missing required credentials' },
                { status: 400 }
            );
        }

        console.log(`[AUTH/LOGIN] Attempt: ${email}, department: ${department}`);

        // 1) Primary: web admins
        const adminsRef = adminDb.collection('web_admins');
        const adminSnapshot = await adminsRef.where('email', '==', email).limit(1).get();

        let userData: any = null;
        let descriptiveUID: string | null = null;
        let isSecurityUser = false;
        let isAdmissionUser = false;

        if (!adminSnapshot.empty) {
            const adminDoc = adminSnapshot.docs[0];
            userData = adminDoc.data();
            descriptiveUID = adminDoc.id;
        } else {
            // 2) Admission users must authenticate from app_admission
            const admissionRef = adminDb.collection('app_admission');
            let admissionSnapshot = await admissionRef.where('email', '==', email).limit(1).get();
            if (admissionSnapshot.empty) {
                admissionSnapshot = await admissionRef.where('official_email', '==', email).limit(1).get();
            }

            if (!admissionSnapshot.empty) {
                const admissionDoc = admissionSnapshot.docs[0];
                userData = admissionDoc.data();
                descriptiveUID = admissionDoc.id;
                isAdmissionUser = true;
                console.log(`[AUTH/LOGIN] Admission user authenticated: ${descriptiveUID}`);
            } else {
                // 3) Security fallback
                const securityRef = adminDb.collection('app_security');
                const securitySnapshot = await securityRef.where('username', '==', email).limit(1).get();

                if (!securitySnapshot.empty) {
                    const securityDoc = securitySnapshot.docs[0];
                    userData = securityDoc.data();
                    descriptiveUID = securityDoc.id;
                    isSecurityUser = true;
                    console.log(`[AUTH/LOGIN] Security user authenticated: ${descriptiveUID}`);
                } else {
                    console.log(`[AUTH/LOGIN] No matching user record for: ${email}`);
                    return NextResponse.json(
                        { error: 'Invalid administrative credentials. Identity focus rejected.' },
                        { status: 401 }
                    );
                }
            }
        }

        // 4) Password check
        if (userData.password !== password) {
            console.log(`[AUTH/LOGIN] Password mismatch for: ${email}`);
            return NextResponse.json(
                { error: 'Invalid master key. Access denied.' },
                { status: 401 }
            );
        }

        // 5) Department alignment for non-security users
        if (!isSecurityUser) {
            const userDept = userData.department;
            const isGenericAdmissionDept = isAdmissionUser && userDept === 'Admission Cell';

            if (!isGenericAdmissionDept && userDept === 'CAMPUS' && department !== 'CAMPUS') {
                return NextResponse.json(
                    { error: 'Global administrators must select "Campus Management" department.' },
                    { status: 403 }
                );
            }
            if (!isGenericAdmissionDept && userDept !== 'CAMPUS' && userDept !== department) {
                return NextResponse.json(
                    { error: `Account department (${userDept}) does not match your selection.` },
                    { status: 403 }
                );
            }
        }

        console.log(`[AUTH/LOGIN] Success: ${descriptiveUID}`);

        return NextResponse.json({
            success: true,
            user: {
                uid: descriptiveUID,
                role: isSecurityUser ? 'security' : (isAdmissionUser ? 'admission' : (userData.role || 'admin')),
                full_name: isSecurityUser ? userData.username : userData.full_name,
                department: isSecurityUser ? 'SECURITY' : userData.department,
                email: isSecurityUser ? userData.username : (userData.email || userData.official_email),
                photoURL: userData.photoURL
            }
        });
    } catch (error: any) {
        console.error('[AUTH/LOGIN] Critical API error:', error);
        return NextResponse.json(
            { error: 'Authentication protocol failure. Please contact system administrator.' },
            { status: 500 }
        );
    }
}
