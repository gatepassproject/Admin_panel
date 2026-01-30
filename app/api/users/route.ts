import { NextResponse } from 'next/server';
import { db1, auth1, db2, auth2 } from '@/lib/firebase-admin';

function getFirebaseInstances(project: string | null) {
    if (project === '1') {
        return { db: db1, auth: auth1 };
    }
    return { db: db2, auth: auth2 };
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const project = searchParams.get('project'); // '1' for gatepass, '2' or null for iot
    const uid = searchParams.get('uid');

    const { db } = getFirebaseInstances(project);

    try {
        if (uid) {
            const doc = await db.collection('users').doc(uid).get();
            if (!doc.exists) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }
            return NextResponse.json({ id: doc.id, ...doc.data() });
        }

        let usersQuery = db.collection('users');

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
        const users = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                uid: doc.id, // Ensure uid is always present as components rely on it
                ...data
            };
        });

        return NextResponse.json(users);
    } catch (error: any) {
        console.error('Error fetching users:', error);
        // Fallback to mock data if DB fails or role is missing
        try {
            const { getMockUsers } = await import('../mockData');
            return NextResponse.json(getMockUsers(role));
        } catch (mockError) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { project, ...userDataRaw } = body;
        const { db, auth } = getFirebaseInstances(project);

        if (!auth || !db) {
            console.warn('Firebase Admin not initialized, returning mock success for create user');
            return NextResponse.json({ success: true, uid: `mock_${Date.now()}` });
        }

        const { email, password, full_name, role, ...rest } = userDataRaw;

        if (!full_name || !role) {
            return NextResponse.json({ error: 'Full name and role are required' }, { status: 400 });
        }

        // Smart format email if only ID is provided
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

        // 1. Create user in Firebase Auth
        const userRecord = await auth.createUser({
            email: finalEmail,
            password: password || 'Password123!',
            displayName: full_name,
        });

        // 2. Prepare structured user document for Firestore
        const userData: any = {
            uid: userRecord.uid,
            email: finalEmail,
            full_name,
            role,
            status: 'Inside',
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
            userData.student_id = rest.student_id;
        }

        // Merge remaining fields
        Object.assign(userData, rest);

        await db.collection('users').doc(userRecord.uid).set(userData);

        return NextResponse.json({ success: true, uid: userRecord.uid, email: finalEmail });
    } catch (error: any) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { uid, project, ...updates } = body;
        const { db, auth } = getFirebaseInstances(project);

        if (!uid) {
            return NextResponse.json({ error: 'User UID is required' }, { status: 400 });
        }

        if (!auth || !db) {
            return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
        }

        // 1. Update Authentication Profile
        if (updates.full_name || updates.password || updates.email) {
            const authUpdates: any = {};
            if (updates.full_name) authUpdates.displayName = updates.full_name;
            if (updates.password) authUpdates.password = updates.password;
            if (updates.email) authUpdates.email = updates.email;

            await auth.updateUser(uid, authUpdates);
        }

        // 2. Update Firestore Document
        const { password, ...firestoreUpdates } = updates;
        firestoreUpdates.updated_at = new Date().toISOString();

        await db.collection('users').doc(uid).update(firestoreUpdates);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const uid = searchParams.get('uid');
        const project = searchParams.get('project');
        const { db, auth } = getFirebaseInstances(project);

        if (!uid) {
            return NextResponse.json({ error: 'User UID is required' }, { status: 400 });
        }

        if (!auth || !db) {
            return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
        }

        // 1. Delete from Authentication
        await auth.deleteUser(uid);

        // 2. Delete from Firestore
        await db.collection('users').doc(uid).delete();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

