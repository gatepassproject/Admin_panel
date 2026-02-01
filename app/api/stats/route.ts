import { NextResponse } from 'next/server';
import { db1, db2, getDepartmentFromRequest } from '@/lib/firebase-admin';
import { getDepartmentCollectionName, isValidDepartmentCode, type DepartmentCode } from '@/lib/constants/departments';

export async function GET(request: Request) {
    // Check if DB is initialized (it might be null if env vars are missing)
    if (!db1 || !db2) {
        console.warn('Firebase Admin not initialized, returning mock stats');
        const { mockStats } = await import('../mockData');
        return NextResponse.json(mockStats);
    }

    try {
        // Get department from request header (set by middleware or client)
        const department = getDepartmentFromRequest(request) as DepartmentCode | null;

        // For master admins, filter by department
        // For super admins, show all data

        // 1. Get Student Count from App DB (Project 1)
        let studentsQuery = db1.collection('users').where('role', '==', 'student');
        if (department && isValidDepartmentCode(department)) {
            studentsQuery = studentsQuery.where('department', '==', department);
        }
        const studentsSnapshot = await studentsQuery.get();
        const studentsCount = studentsSnapshot.size;

        // 2. Get Faculty Count from App DB (Project 1)
        let facultyQuery = db1.collection('users').where('role', 'in', ['faculty', 'hod', 'principal']);
        if (department && isValidDepartmentCode(department)) {
            facultyQuery = facultyQuery.where('department', '==', department);
        }
        const facultySnapshot = await facultyQuery.get();
        const facultyCount = facultySnapshot.size;

        // 3. Get Active Passes (Approved) from App DB (Project 1)
        let activePassesQuery = db1.collection('gate_passes').where('status', '==', 'Approved');
        if (department && isValidDepartmentCode(department)) {
            activePassesQuery = activePassesQuery.where('department', '==', department);
        }
        const activePassesSnapshot = await activePassesQuery.get();
        const activePassesCount = activePassesSnapshot.size;

        // 4. Get Active Gates (From IoT System - Project 2)
        // Gates are shared across departments
        const gatesSnapshot = await db2.collection('gate_status').get();
        const gatesCount = gatesSnapshot.size;
        const onlineGatesCount = gatesSnapshot.docs.filter(doc => doc.data().status === 'OPEN' || doc.data().status === 'Online').length;

        // 5. Get Recent Activity from App DB (Project 1)
        let recentPassesQuery = db1.collection('gate_passes')
            .orderBy('updated_at', 'desc')
            .limit(5);
        if (department && isValidDepartmentCode(department)) {
            recentPassesQuery = recentPassesQuery.where('department', '==', department);
        }
        const recentPassesSnapshot = await recentPassesQuery.get();

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


        // 6. Get Weekly Stats from App DB (Project 1)
        let weeklyStatsQuery = db1.collection('gate_passes')
            .where('created_at', '>=', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
        if (department && isValidDepartmentCode(department)) {
            weeklyStatsQuery = weeklyStatsQuery.where('department', '==', department);
        }
        const weeklyStatsSnapshot = await weeklyStatsQuery.get();

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
            department: department || 'all',
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
