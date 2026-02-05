import { NextResponse } from 'next/server';
import { db1, db2, getDepartmentFromRequest } from '@/lib/firebase-admin';
import { getDepartmentCollectionName, isValidDepartmentCode, type DepartmentCode, getDepartmentByCode } from '@/lib/constants/departments';

export async function GET(request: Request) {
    // Check if DB is initialized (it might be null if env vars are missing)
    if (!db1 || !db2) {
        console.warn('Firebase Admin not initialized, returning mock stats');
        const { mockStats } = await import('../mockData');
        return NextResponse.json(mockStats);
    }

    try {
        // Get department and role from request headers (set by middleware/cookies)
        const department = getDepartmentFromRequest(request) as DepartmentCode | null;

        // Extract role from cookies
        const cookiesStr = request.headers.get('cookie') || '';
        const roleCookie = cookiesStr.split('; ').find(row => row.startsWith('user_role='));
        const userRole = roleCookie ? roleCookie.split('=')[1] : null;

        // Expanded visibility for institutional leaders
        // admin: System Administrator
        // principal: College Head
        // higher_authority: Management
        const isManagement = userRole === 'admin' || userRole === 'principal' || userRole === 'higher_authority';

        const shouldFilter = department &&
            department !== 'CAMPUS' &&
            !isManagement &&
            isValidDepartmentCode(department);

        // 1. Get Student Count from App DB (Project 1)
        // Check both 'app_student' and 'add_student' (mentioned by user)
        const studentCollections = ['app_student', 'add_student'];
        let studentsCount = 0;

        for (const colName of studentCollections) {
            let studentsQuery: FirebaseFirestore.Query = db1.collection(colName);
            // Use refined shouldFilter logic
            if (shouldFilter) {
                const deptInfo = getDepartmentByCode(department!);
                const possibleValues: string[] = [department]; // e.g. 'CSE'

                if (deptInfo) {
                    possibleValues.push(deptInfo.name); // e.g. 'Computer Science Engineering'
                    if (department === 'CSE') possibleValues.push('Computer Science');
                }
                studentsQuery = studentsQuery.where('department', 'in', possibleValues);
            }
            const snapshot = await studentsQuery.get();
            studentsCount += snapshot.docs.filter(doc => doc.id !== 'README').length;
        }

        // 2. Get Faculty Count from App DB (Project 1)
        // Check all potential faculty collections including new ones mentioned by user
        const facultyCollections = ['app_faculty', 'add_faculty', 'add_facutly'];
        let facultyCount = 0;

        for (const collectionName of facultyCollections) {
            let query: FirebaseFirestore.Query = db1.collection(collectionName);
            // Use refined shouldFilter logic
            if (shouldFilter) {
                const deptInfo = getDepartmentByCode(department!);
                const possibleValues: string[] = [department]; // e.g. 'CSE'

                if (deptInfo) {
                    possibleValues.push(deptInfo.name); // e.g. 'Computer Science Engineering'
                    if (department === 'CSE') possibleValues.push('Computer Science');
                }
                query = query.where('department', 'in', possibleValues);
            }
            const snapshot = await query.get();
            facultyCount += snapshot.docs.filter(doc => doc.id !== 'README').length;
        }

        // 3. Get Active Passes (Approved) from App DB (Project 1)
        let activePassesQuery = db1.collection('gate_passes').where('status', '==', 'Approved');
        if (shouldFilter) {
            activePassesQuery = activePassesQuery.where('department', '==', department);
        }
        const activePassesSnapshot = await activePassesQuery.get();
        const activePassesCount = activePassesSnapshot.size;

        // 4. Get Active Gates (From IoT System - Project 2)
        // Check 'gate_status' first, then fallback to 'gates' if empty
        let gatesSnapshot = await db2.collection('gate_status').get();
        if (gatesSnapshot.empty) {
            gatesSnapshot = await db2.collection('gates').get();
        }

        const gatesCount = gatesSnapshot.size;
        const onlineGatesCount = gatesSnapshot.docs.filter(doc => {
            const status = doc.data().status;
            return status === 'OPEN' || status === 'Online' || status === 'online' || status === 'active';
        }).length;

        // 5. Get Recent Activity from App DB (Project 1)
        let recentPassesQuery = db1.collection('gate_passes').orderBy('updated_at', 'desc').limit(20);
        const recentPassesSnapshot = await recentPassesQuery.get();
        let recentDocs = recentPassesSnapshot.docs;

        if (Boolean(shouldFilter)) {
            recentDocs = recentDocs.filter(doc => doc.data().department === department);
        }

        const recentActivity = recentDocs.slice(0, 5).map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                user: data.student_name || data.full_name || 'Unknown User',
                action: data.status === 'Approved' ? 'Exit Approved' :
                    data.status === 'Rejected' ? 'Pass Rejected' :
                        data.status === 'Pending' ? 'Pass Requested' : 'Activity Recorded',
                gate: data.gate || 'Main Gate',
                time: data.updated_at || data.created_at,
                status: data.status
            };
        });

        // 6. Get Weekly Stats from App DB (Project 1)
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        let weeklyStatsQuery = db1.collection('gate_passes').where('created_at', '>=', oneWeekAgo);
        const weeklyStatsSnapshot = await weeklyStatsQuery.get();
        let weeklyDocs = weeklyStatsSnapshot.docs;

        if (Boolean(shouldFilter)) {
            weeklyDocs = weeklyDocs.filter(doc => doc.data().department === department);
        }

        const weeklyStatsMap = new Map();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayName = days[d.getDay()];
            weeklyStatsMap.set(dayName, 0);
        }

        weeklyDocs.forEach(doc => {
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
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
