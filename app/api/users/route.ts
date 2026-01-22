import { NextResponse } from 'next/server';
import { db1, auth1 } from '@/lib/firebase-admin';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');

        let usersQuery = db1.collection('users');

        if (role) {
            // @ts-ignore
            usersQuery = usersQuery.where('role', '==', role);
        }

        const snapshot = await usersQuery.get();
        const users = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(users);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, full_name, role, ...rest } = body;

        // 1. Create user in Firebase Auth
        const userRecord = await auth1.createUser({
            email,
            password,
            displayName: full_name,
        });

        // 2. Create user document in Firestore
        const userData = {
            uid: userRecord.uid,
            email,
            full_name,
            role,
            ...rest,
            status: 'Active',
            created_at: new Date().toISOString(),
        };

        await db1.collection('users').doc(userRecord.uid).set(userData);

        return NextResponse.json({ success: true, uid: userRecord.uid });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
