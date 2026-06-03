import { NextResponse } from 'next/server';
import { db2 } from '@/lib/firebase-admin';
import { serverCache } from '@/lib/cache';

export async function GET(request: Request) {
    if (!db2) {
        return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const limitParam = searchParams.get('limit');
        const limit = limitParam ? parseInt(limitParam) : 50;

        // Check cache (30 sec TTL)
        const cacheKey = `logs_${limit}`;
        const cached = serverCache.get(cacheKey);
        if (cached) return NextResponse.json(cached);

        // Fetch recent logs
        const snapshot = await db2.collection('gate_passes')
            .orderBy('created_at', 'desc')
            .limit(limit)
            .get();

        const logs = snapshot.docs.map(doc => {
            const data = doc.data();
            
            // Helper to parse Firestore Timestamp or ISO string
            const parseDate = (val: any) => {
                if (!val) return new Date();
                if (typeof val.toDate === 'function') return val.toDate();
                if (typeof val === 'string' || typeof val === 'number') return new Date(val);
                if (val._seconds !== undefined) return new Date(val._seconds * 1000);
                if (val.seconds !== undefined) return new Date(val.seconds * 1000);
                return new Date();
            };

            const timestamp = data.updated_at || data.created_at;
            const dateObj = parseDate(timestamp);

            return {
                id: doc.id,
                user: data.student_name || data.full_name || 'Unknown User',
                role: data.role || 'Student',
                gate: data.gate || 'Main Gate',
                type: (data.status === 'Outside' || data.status === 'Approved') ? 'Exit' : 'Entry',
                time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                date: dateObj.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }),
                status: data.status === 'Approved' ? 'Authorized' : data.status === 'Rejected' ? 'Denied' : data.status,
                timestamp: dateObj.toISOString()
            };
        });

        const result = { logs };
        serverCache.set(cacheKey, result, 30);
        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Logs API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
