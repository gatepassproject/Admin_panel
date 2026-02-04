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

        // 1. Query Firestore for the admin profile
        const adminsRef = adminDb.collection('web_admins');
        const snapshot = await adminsRef.where('email', '==', email).limit(1).get();

        if (snapshot.empty) {
            console.log(`❌ No administrative record found for: ${email}`);
            return NextResponse.json(
                { error: 'Invalid administrative credentials. Identity focus rejected.' },
                { status: 401 }
            );
        }

        const adminDoc = snapshot.docs[0];
        const userData = adminDoc.data();
        const descriptiveUID = adminDoc.id;

        // 2. Verify Password (Professional check against records)
        if (userData.password !== password) {
            console.log(`❌ Password mismatch for: ${email}`);
            return NextResponse.json(
                { error: 'Invalid master key. Access denied.' },
                { status: 401 }
            );
        }

        // 3. Verify Department Alignment
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

        console.log(`✅ Professional Identity Verified: ${descriptiveUID}`);

        // 4. Return success with user data
        // We return the descriptive UID as the session ID
        return NextResponse.json({
            success: true,
            user: {
                uid: descriptiveUID,
                role: userData.role || 'admin',
                full_name: userData.full_name,
                department: userDept,
                email: userData.email,
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
