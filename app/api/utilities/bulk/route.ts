import { NextResponse } from 'next/server';
import { db1, auth1, db2, auth2 } from '@/lib/firebase-admin';

export async function POST(request: Request) {
    if (!auth1 || !db1 || !auth2 || !db2) {
        return NextResponse.json({ error: 'Firebase systems not fully synchronized' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { students, type } = body;

        if (!students || !Array.isArray(students)) {
            return NextResponse.json({ error: 'Payload must contain a students array' }, { status: 400 });
        }

        let successCount = 0;
        let failedCount = 0;
        const errors: any[] = [];

        // Processing students one by one (or in small chunks) to handle Auth creation
        // Note: auth.createUser doesn't have a batch API
        for (const student of students) {
            try {
                console.log(`Processing student: ${JSON.stringify(student)}`);

                const regNo = student.registration_no || student.roll_no || student.id || student.reg_no;
                const fullName = student.full_name || student.name || `${student.first_name || ''} ${student.last_name || ''}`.trim();
                const password = student.password || 'Student@123';

                if (!regNo || !fullName) {
                    console.warn('Skipping student due to missing Registration No or Full Name', student);
                    throw new Error(`Missing required fields: Registration Number or Full Name`);
                }

                const email = `${regNo.toLowerCase().replace(/[^a-z0-z0-9]/g, '')}@ctgroup.in`;
                console.log(`Derived email: ${email}`);

                // 1. Project 1 (GatePass)
                let uid1 = '';
                try {
                    const user1 = await auth1.createUser({
                        email,
                        password,
                        displayName: fullName,
                    });
                    uid1 = user1.uid;
                    console.log(`Created user in Project 1: ${uid1}`);
                } catch (e1: any) {
                    if (e1.code === 'auth/email-already-exists') {
                        const existingUser = await auth1.getUserByEmail(email);
                        uid1 = existingUser.uid;
                        console.log(`User already exists in Project 1: ${uid1}`);
                    } else throw e1;
                }

                if (uid1) {
                    await db1.collection('users').doc(uid1).set({
                        uid: uid1,
                        full_name: fullName,
                        email,
                        role: 'student',
                        student_id: regNo,
                        department: student.department || student.dept || 'General',
                        status: 'Inside',
                        created_at: new Date().toISOString(),
                        ...student
                    });
                }

                // 2. Project 2 (IoT)
                let uid2 = '';
                try {
                    const user2 = await auth2.createUser({
                        email,
                        password,
                        displayName: fullName,
                    });
                    uid2 = user2.uid;
                    console.log(`Created user in Project 2: ${uid2}`);
                } catch (e2: any) {
                    if (e2.code === 'auth/email-already-exists') {
                        const existingUser = await auth2.getUserByEmail(email);
                        uid2 = existingUser.uid;
                        console.log(`User already exists in Project 2: ${uid2}`);
                    } else throw e2;
                }

                if (uid2) {
                    await db2.collection('users').doc(uid2).set({
                        uid: uid2,
                        full_name: fullName,
                        email,
                        role: 'student',
                        student_id: regNo,
                        department: student.department || student.dept || 'General',
                        status: 'Inside',
                        created_at: new Date().toISOString(),
                        ...student
                    });
                }

                successCount++;
            } catch (err: any) {
                console.error(`Error processing student record: ${err.message}`, err);
                failedCount++;
                errors.push({ student, error: err.message });
            }
        }

        // Log the batch operation in the primary database
        await db1.collection('admin_logs').add({
            action: 'Bulk Import',
            details: `Processed ${students.length} students. Success: ${successCount}, Failed: ${failedCount}`,
            timestamp: new Date().toISOString(),
            errors: errors.slice(0, 10) // Only log first 10 errors to avoid doc size limit
        });

        return NextResponse.json({
            success: true,
            processed: successCount,
            failed: failedCount,
            errors: errors.length > 0 ? errors : undefined,
            message: `Successfully processed ${successCount} records. ${failedCount} failures.`
        });

    } catch (error: any) {
        console.error('Critical failure in bulk API:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
