import { NextResponse } from 'next/server';
import { db1 } from '@/lib/firebase-admin';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const student_id = searchParams.get('student_id');

    if (!db1) {
        console.warn('Firebase Admin not initialized, returning mock passes');
        const { mockPasses } = await import('../mockData');
        let passes = mockPasses;
        if (status) passes = passes.filter(p => p.status === status);
        if (student_id) passes = passes.filter(p => p.student_id === student_id);
        return NextResponse.json(passes);
    }

    try {
        let query = db1.collection('gate_passes');

        if (status) {
            // @ts-ignore
            query = query.where('status', '==', status);
        }

        if (student_id) {
            // @ts-ignore
            query = query.where('student_id', '==', student_id);
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
    try {
        const { id, status, remarks } = await request.json();

        if (!id) throw new Error('Pass ID is required');

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
