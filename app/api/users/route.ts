import { NextResponse } from 'next/server';
import { db2, auth2 } from '@/lib/firebase-admin';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

<<<<<<< HEAD
    if (!db1) {
        console.warn('Firebase Admin not initialized, returning mock users');
        const { getMockUsers } = await import('../mockData');
        return NextResponse.json(getMockUsers(role));
    }

    try {
        let usersQuery = db1.collection('users');
=======
        let usersQuery = db2.collection('users');
>>>>>>> ba475b768eb0ddae6ee98d7d7b1f7f2708033217

        if (role) {
            const roles = role.split(',');
            if (roles.length > 1) {
                // @ts-ignore
                usersQuery = usersQuery.where('role', 'in', roles);
            } else {
                // @ts-ignore
                usersQuery = usersQuery.where('role', '==', role);
            }
        }

        const snapshot = await usersQuery.get();
        const users = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(users);
    } catch (error: any) {
        console.error('Error fetching users:', error);
        const { getMockUsers } = await import('../mockData');
        return NextResponse.json(getMockUsers(role));
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!auth1 || !db1) {
            console.warn('Firebase Admin not initialized, returning mock success for create user');
            return NextResponse.json({ success: true, uid: `mock_${Date.now()}` });
        }

        const { email, password, full_name, role, ...rest } = body;

        if (!full_name || !role) {
            return NextResponse.json({ error: 'Full name and role are required' }, { status: 400 });
        }

        // Smart format email if only ID is provided (for students/faculty/staff)
        let finalEmail = email;
        const officialRoles = ['student', 'faculty', 'hod', 'principal', 'admission', 'higher_authority', 'security'];

        if (!finalEmail || !finalEmail.includes('@')) {
            const id = rest.student_id || rest.id || email;
            if (!id) {
                return NextResponse.json({ error: 'Email or ID is required' }, { status: 400 });
            }

            if (officialRoles.includes(role)) {
                finalEmail = `${id}@ctgroup.in`;
            } else if (role === 'parent') {
                finalEmail = `${id}@gatepass.com`;
            } else {
                finalEmail = `${id}@system.local`;
            }
        }

        // 1. Create user in Firebase Auth (Project 2)
        const userRecord = await auth2.createUser({
            email: finalEmail,
            password: password || 'Password123!',
            displayName: full_name,
        });

        // 2. Prepare structured user document for Firestore (Project 2)
        const userData: any = {
            uid: userRecord.uid,
            email: finalEmail,
            full_name,
            role,
            status: 'Inside', // Default status
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        // Role-specific field mapping
        if (role === 'student') {
            userData.student_id = rest.student_id || rest.id;
            userData.department = rest.dept || rest.department;
            userData.year = rest.year;
            userData.father_name = rest.father_name;
            userData.guardian_phone = rest.guardian_phone;
            userData.address = rest.address;
        } else if (['faculty', 'hod', 'principal'].includes(role)) {
            userData.department = rest.dept || rest.department;
            userData.designation = rest.designation;
            userData.phone = rest.phone;
        } else if (role === 'security') {
            userData.phone = rest.phone;
            userData.gate = rest.gate || 'Main Gate';
            userData.shift = rest.shift || 'Morning';
        } else if (role === 'parent') {
            userData.phone = rest.phone;
            userData.student_id = rest.student_id; // Linked student
        }

        // Merge remaining fields for flexibility
        Object.assign(userData, rest);

        await db2.collection('users').doc(userRecord.uid).set(userData);

        return NextResponse.json({ success: true, uid: userRecord.uid, email: finalEmail });
    } catch (error: any) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
