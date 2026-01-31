import { NextResponse } from 'next/server';
import { db1, auth1, db2, auth2, admin } from '@/lib/firebase-admin';

const ADMIN_USERS = [
    {
        email: 'masteradmin@gmail.com',
        password: 'masterct@123',
        full_name: 'Master Admin',
        role: 'admin', // System-wide master admin
    },
    {
        email: 'principal@gmail.com',
        password: 'principal123',
        full_name: 'Campus Principal',
        role: 'principal',
    },
    {
        email: 'hod@gmail.com',
        password: 'password123',
        full_name: 'Department HOD',
        role: 'hod',
        dept: 'Computer Science',
    },
    {
        email: 'faculty@gmail.com',
        password: 'password@123',
        full_name: 'Lead Faculty',
        role: 'faculty',
        dept: 'Computer Science',
    }
];

async function seedUserToProject(userDataRaw: any, project: '1' | '2') {
    const auth = project === '1' ? auth1 : auth2;
    const db = project === '1' ? db1 : db2;

    if (!auth || !db) {
        throw new Error(`Firebase Admin not initialized for project ${project}`);
    }

    const { email, password, full_name, role, ...rest } = userDataRaw;

    try {
        // 1. Check if user exists in Auth
        let userRecord;
        try {
            userRecord = await auth.getUserByEmail(email);
            console.log(`User ${email} already exists in project ${project} Auth. Updating password...`);
            await auth.updateUser(userRecord.uid, { password });
        } catch (e: any) {
            if (e.code === 'auth/user-not-found') {
                userRecord = await auth.createUser({
                    email,
                    password,
                    displayName: full_name,
                });
                console.log(`Created user ${email} in project ${project} Auth.`);
            } else {
                throw e;
            }
        }

        // 2. Add/Update Firestore Document
        const userData: any = {
            uid: userRecord.uid,
            email,
            full_name,
            role,
            status: 'Inside',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...rest
        };

        const collectionName = project === '2' ? 'web_admins' : 'users';

        await db.collection(collectionName).doc(userRecord.uid).set(userData);
        console.log(`Set Firestore doc for ${email} in project ${project} (${collectionName}).`);

        return { success: true, uid: userRecord.uid };
    } catch (error: any) {
        console.error(`Error seeding ${email} to project ${project}:`, error);
        return { success: false, error: error.message };
    }
}

export async function GET() {
    const results: any[] = [];

    try {
        for (const user of ADMIN_USERS) {
            // Seed to GatePass (Project 1)
            const res1 = await seedUserToProject(user, '1');
            // Seed to IoT (Project 2)
            const res2 = await seedUserToProject(user, '2');

            results.push({
                email: user.email,
                project1: res1,
                project2: res2
            });
        }

        return NextResponse.json({
            message: 'Seeding process completed',
            results
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
