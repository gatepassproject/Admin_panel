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

        console.log(`🔐 API Auth Attempt: ${email} for department ${department}`);

        // 1. Query Firestore for the admin profile in web_admins
        const adminsRef = adminDb.collection('web_admins');
        let snapshot = await adminsRef.where('email', '==', email).limit(1).get();
        let userData = null;
        let descriptiveUID = null;
        let isSecurityUser = false;

        if (snapshot.empty) {
            // Check if this is a security user in app_security collection
            const securityRef = adminDb.collection('app_security');
            const securitySnapshot = await securityRef.where('username', '==', email).limit(1).get();
            
            if (!securitySnapshot.empty) {
                const securityDoc = securitySnapshot.docs[0];
                userData = securityDoc.data();
                descriptiveUID = securityDoc.id;
                isSecurityUser = true;
                console.log(`🔐 Security User Authenticated: ${descriptiveUID}`);
            } else {
                console.log(`❌ No administrative record found for: ${email}`);
                return NextResponse.json(
                    { error: 'Invalid administrative credentials. Identity focus rejected.' },
                    { status: 401 }
                );
            }
        } else {
            const adminDoc = snapshot.docs[0];
            userData = adminDoc.data();
            descriptiveUID = adminDoc.id;
        }

        // 2. Verify Password
        if (userData.password !== password) {
            console.log(`❌ Password mismatch for: ${email}`);
            return NextResponse.json(
                { error: 'Invalid master key. Access denied.' },
                { status: 401 }
            );
        }

        // 3. For security users, skip department check
        if (!isSecurityUser) {
            // Verify Department Alignment for admin users
            const userDept = userData.department;
            if (userDept === 'CAMPUS' && department !== 'CAMPUS') {
                return NextResponse.json(
                    { error: 'Global administrators must select "Campus Management" department.' },
                    { status: 403 }
                );
            }
            if (userDept !== 'CAMPUS' && userDept !== department) {
                return NextResponse.json(
                    { error: `Account department (${userDept}) does not match your selection.` },
                    { status: 403 }
                );
            }
        }

        console.log(`✅ Professional Identity Verified: ${descriptiveUID}`);

        // 4. Return success with user data
        return NextResponse.json({
            success: true,
            user: {
                uid: descriptiveUID,
                role: isSecurityUser ? 'security' : (userData.role || 'admin'),
                full_name: isSecurityUser ? userData.username : userData.full_name,
                department: isSecurityUser ? 'SECURITY' : userData.department,
                email: isSecurityUser ? userData.username : userData.email,
                photoURL: userData.photoURL
            }
        });

    } catch (error: any) {
        console.error('💥 Critical Login API Error:', error);
        return NextResponse.json(
            { error: 'Authentication protocol failure. Please contact system administrator.' },
            { status: 500 }
        );
    }
}
