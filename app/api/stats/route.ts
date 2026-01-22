import { NextResponse } from 'next/server';
import { db1, db2 } from '@/lib/firebase-admin';

export async function GET() {
    try {
        // 1. Get Student Count
        const studentsSnapshot = await db1.collection('users').where('role', '==', 'student').get();
        const studentsCount = studentsSnapshot.size;

        // 2. Get Faculty Count
        const facultySnapshot = await db1.collection('users').where('role', 'in', ['faculty', 'hod']).get();
        const facultyCount = facultySnapshot.size;

        // 3. Get Active Passes (Approved)
        const activePassesSnapshot = await db1.collection('gate_passes').where('status', '==', 'Approved').get();
        const activePassesCount = activePassesSnapshot.size;

        // 4. Get Active Gates (From IoT System)
        const gatesSnapshot = await db2.collection('gate_status').get();
        const gatesCount = gatesSnapshot.size;
        const onlineGatesCount = gatesSnapshot.docs.filter(doc => doc.data().status === 'OPEN' || doc.data().status === 'Online').length;

        return NextResponse.json({
            students: studentsCount,
            faculty: facultyCount,
            activePasses: activePassesCount,
            totalGates: gatesCount,
            onlineGates: onlineGatesCount,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
