import { NextResponse } from 'next/server';
import { db1 } from '@/lib/firebase-admin';
import { getRequesterIdentity, getEffectiveDepartment, applyDepartmentFilter } from '@/lib/department-isolation';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const student_id = searchParams.get('student_id');

    if (!db1) {
        const { mockPasses } = await import('../mockData');
        return NextResponse.json(mockPasses);
    }

    try {
        const requester = getRequesterIdentity(request);
        const department = getEffectiveDepartment(requester, searchParams.get('department'));
        console.log(`[API/Passes] Fetching passes... status=${status}, user_dept=${requester.department}, filter_dept=${department}`);

        let query: FirebaseFirestore.Query = db1.collection('gate_passes');

        // Note: For robustness, we fetch broadly for the department and filter status/other fields in memory.
        // This handles case-sensitivity issues and variations in field names.

        let snapshot: FirebaseFirestore.QuerySnapshot;

        if (department) {
            // Fetch by department (this is the main isolation boundary)
            snapshot = await applyDepartmentFilter(query, department).limit(300).get();

            // Fallback: If no docs with 'department' field, try 'destination' field
            if (snapshot.empty) {
                const deptInfo = (await import('@/lib/constants/departments')).getDepartmentByCode(department);
                if (deptInfo) {
                    snapshot = await query.where('destination', '==', deptInfo.name).limit(300).get();
                }
            }
        } else {
            // Global view for admins without department restriction
            snapshot = await query.orderBy('created_at', 'desc').limit(300).get();
        }

        console.log(`[API/Passes] Loaded ${snapshot.size} raw documents from Firestore`);

        let passes = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // In-memory Status Filtering (Case-Insensitive)
        if (status && status !== 'All') {
            const targetStatus = status.toLowerCase();
            passes = passes.filter((p: any) =>
                p.status?.toLowerCase() === targetStatus
            );
            console.log(`[API/Passes] Filtered to ${passes.length} documents with status=${status}`);
        }

        // In-memory sorting (Robust fallback for various timestamp fields)
        passes.sort((a: any, b: any) => {
            const extractTime = (p: any) => {
                const t = p.created_at || p.date || p.start_time || p.approval_date;
                return t?._seconds || (t ? new Date(t).getTime() / 1000 : 0);
            };
            return extractTime(b) - extractTime(a);
        });

        return NextResponse.json(passes);
    } catch (error: any) {
        console.error('❌ [API/Passes] Error fetching passes:', error);
        return NextResponse.json([]);
    }
}

export async function PATCH(request: Request) {
    if (!db1) return NextResponse.json({ success: true }); // Mock success if no DB

    try {
        const requester = getRequesterIdentity(request);
        const { id, status, remarks } = await request.json();

        if (!id) throw new Error('Pass ID is required');

        const passDoc = await db1.collection('gate_passes').doc(id).get();
        if (!passDoc.exists) {
            return NextResponse.json({ error: 'Pass not found' }, { status: 404 });
        }

        const passData = passDoc.data() || {};

        // Validation: If not global, must belong to the same department
        if (!requester.isGlobal) {
            if (passData.department !== requester.department) {
                // Check if they use the Full Name of the department
                const deptInfo = requester.department ? (await import('@/lib/constants/departments')).getDepartmentByCode(requester.department) : null;
                if (passData.department !== deptInfo?.name) {
                    return NextResponse.json({ error: 'Permission denied: Pass belongs to another department' }, { status: 403 });
                }
            }
        }

        await db1.collection('gate_passes').doc(id).update({
            status,
            remarks,
            updated_at: new Date().toISOString()
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
