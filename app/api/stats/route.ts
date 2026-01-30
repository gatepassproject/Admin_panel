import { NextResponse } from 'next/server';
import { db1, db2 } from '@/lib/firebase-admin';

export async function GET() {
    // Check if DB is initialized (it might be null if env vars are missing)
    if (!db1 || !db2) {
        console.warn('Firebase Admin not initialized, returning mock stats');
        const { mockStats } = await import('../mockData');
        return NextResponse.json(mockStats);
    }

    try {
        // 1. Get Student Count
        const studentsSnapshot = await db2.collection('users').where('role', '==', 'student').get();
        const studentsCount = studentsSnapshot.size;

        // 2. Get Faculty Count
        const facultySnapshot = await db2.collection('users').where('role', 'in', ['faculty', 'hod', 'principal']).get();
        const facultyCount = facultySnapshot.size;

        // 3. Get Active Passes (Approved)
        const activePassesSnapshot = await db2.collection('gate_passes').where('status', '==', 'Approved').get();
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
<<<<<<< HEAD
        console.error('Error fetching stats:', error);
        // Fallback to mock data on error too
        const { mockStats } = await import('../mockData');
        return NextResponse.json(mockStats);
=======
        console.error('API Error /api/stats:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
>>>>>>> ba475b768eb0ddae6ee98d7d7b1f7f2708033217
    }
}