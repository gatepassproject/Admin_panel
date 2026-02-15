import { NextResponse } from 'next/server';
import { db1 } from '@/lib/firebase-admin';
import { getRequesterIdentity, getEffectiveDepartment, applyDepartmentFilter } from '@/lib/department-isolation';
import { serverCache, cacheKeys } from '@/lib/cache';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const student_id = searchParams.get('student_id');
    const page = parseInt(searchParams.get('page') || '1');
    const pageLimit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

    if (!db1) {
        const { mockPasses } = await import('../mockData');
        return NextResponse.json(mockPasses);
    }

    try {
        const requester = getRequesterIdentity(request);
        const department = getEffectiveDepartment(requester, searchParams.get('department'));

        // Check cache first (TTL: 30 seconds)
        const cacheKey = `passes_${status || 'all'}_${department || 'all'}_p${page}`;
        const cached = serverCache.get(cacheKey);
        if (cached) return NextResponse.json(cached);

        console.log(`[API/Passes] Fetching passes... status=${status}, dept=${department}, page=${page}`);

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

        // In-memory sorting
        passes.sort((a: any, b: any) => {
            const extractTime = (p: any) => {
                const t = p.created_at || p.date || p.start_time || p.approval_date;
                return t?._seconds || (t ? new Date(t).getTime() / 1000 : 0);
            };
            return extractTime(b) - extractTime(a);
        });

        // Apply pagination
        const totalCount = passes.length;
        const startIdx = (page - 1) * pageLimit;
        const paginatedPasses = passes.slice(startIdx, startIdx + pageLimit);

        const result = {
            data: paginatedPasses,
            pagination: {
                page,
                limit: pageLimit,
                total: totalCount,
                totalPages: Math.ceil(totalCount / pageLimit),
                hasMore: startIdx + pageLimit < totalCount
            }
        };

        // Cache for 30 seconds
        serverCache.set(cacheKey, result, 30);

        return NextResponse.json(result);
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

        // Invalidate related caches
        serverCache.invalidate('passes_*');
        serverCache.invalidate('stats_*');

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
