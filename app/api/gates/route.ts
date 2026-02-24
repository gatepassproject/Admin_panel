import { NextResponse } from 'next/server';
import { firestore as db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

export async function GET() {
    if (!db) {
        console.warn('Firebase Client not initialized, returning mock gates');
        const { mockGates } = await import('../mockData');
        return NextResponse.json(mockGates);
    }

    try {
        const snapshot = await getDocs(collection(db, 'gate_status'));
        const gates = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(gates);
    } catch (error: any) {
        console.error('Error fetching gates:', error);
        const { mockGates } = await import('../mockData');
        return NextResponse.json(mockGates);
    }
}

export async function POST(request: Request) {
    try {
        const { id, status, name } = await request.json();

        if (!id) throw new Error('Gate ID is required');

        await setDoc(doc(db, 'gate_status', id), {
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
