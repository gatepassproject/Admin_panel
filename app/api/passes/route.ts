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

        let query: FirebaseFirestore.Query = db1.collection('gate_passes');

        if (status) {
            query = query.where('status', '==', status);
        }

        if (student_id) {
            query = query.where('student_id', '==', student_id);
        }

        if (department) {
            // Passes collection uses standard department names/codes
            query = applyDepartmentFilter(query, department);
        }

        const snapshot = await query.orderBy('created_at', 'desc').get();
        const passes = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(passes);
    } catch (error: any) {
        console.error('Error fetching passes:', error);
        const { mockPasses } = await import('../mockData');
        return NextResponse.json(mockPasses);
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
