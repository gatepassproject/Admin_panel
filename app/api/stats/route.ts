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

        // 5. Get Recent Activity (Last 5 updated/created passes)
        const recentPassesSnapshot = await db2.collection('gate_passes')
            .orderBy('updated_at', 'desc')
            .limit(5)
            .get();

        const recentActivity = recentPassesSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                user: data.student_name || data.full_name || 'Unknown User',
                action: data.status === 'Approved' ? 'Exit Approved' :
                    data.status === 'Rejected' ? 'Pass Rejected' :
                        data.status === 'Pending' ? 'Pass Requested' : 'Activity Recorded',
                gate: data.gate || 'Main Gate',
                time: data.updated_at || data.created_at,
                // Helper for UI status mapping
                status: data.status
            };
        });


        // 6. Get Weekly Stats (Last 7 days pass count)
        const weeklyStatsSnapshot = await db2.collection('gate_passes')
            .where('created_at', '>=', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
            .get();

        const weeklyStatsMap = new Map();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Initialize last 7 days with 0
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayName = days[d.getDay()];
            weeklyStatsMap.set(dayName, 0);
        }

        weeklyStatsSnapshot.docs.forEach(doc => {
            const date = new Date(doc.data().created_at);
            const dayName = days[date.getDay()];
            if (weeklyStatsMap.has(dayName)) {
                weeklyStatsMap.set(dayName, weeklyStatsMap.get(dayName) + 1);
            }
        });

        const weeklyStats = Array.from(weeklyStatsMap).map(([day, passes]) => ({ day, passes }));

        return NextResponse.json({
            students: studentsCount,
            faculty: facultyCount,
            activePasses: activePassesCount,
            totalGates: gatesCount,
            onlineGates: onlineGatesCount,
            recentActivity,
            weeklyStats,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('API Error /api/stats:', error);
        try {
            const { mockStats } = await import('../mockData');
            return NextResponse.json({ ...mockStats, error: error.message, is_mock: true });
        } catch (e) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}