import { NextResponse } from 'next/server';
import { db2 } from '@/lib/firebase-admin';

export async function GET() {
    try {
        const snapshot = await db2.collection('gate_status').get();
        const gates = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(gates);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { id, status, name } = await request.json();

        if (!id) throw new Error('Gate ID is required');

        await db2.collection('gate_status').doc(id).set({
            name,
            status,
            last_active: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }, { merge: true });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
