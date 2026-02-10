import { NextResponse } from 'next/server';
import { db1 } from '@/lib/firebase-admin';
import { getRequesterIdentity } from '@/lib/department-isolation';

export async function GET(request: Request) {
    if (!db1) return NextResponse.json([]);

    try {
        const snapshot = await db1.collection('communication_templates').get();
        const templates = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Sort by lastModified/created_at
        templates.sort((a: any, b: any) => {
            const timeA = a.updated_at || a.created_at || 0;
            const timeB = b.updated_at || b.created_at || 0;
            return new Date(timeB).getTime() - new Date(timeA).getTime();
        });

        return NextResponse.json(templates);
    } catch (error: any) {
        console.error('❌ [API/Templates] GET Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!db1) return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });

    try {
        const requester = getRequesterIdentity(request);
        const data = await request.json();

        const docRef = await db1.collection('communication_templates').add({
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: requester.uid || 'system',
            department: data.department || requester.department || null
        });

        return NextResponse.json({ id: docRef.id, success: true });
    } catch (error: any) {
        console.error('❌ [API/Templates] POST Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    if (!db1) return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });

    try {
        const { id, ...updates } = await request.json();
        if (!id) throw new Error('Template ID is required');

        await db1.collection('communication_templates').doc(id).update({
            ...updates,
            updated_at: new Date().toISOString()
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('❌ [API/Templates] PATCH Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (!db1) return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) throw new Error('Template ID is required');

        await db1.collection('communication_templates').doc(id).delete();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('❌ [API/Templates] DELETE Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
