import { NextResponse } from 'next/server';
import { db1 } from '@/lib/firebase-admin';

export async function GET() {
    try {
        if (!db1) {
            return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
        }
        const doc = await db1.collection('settings').doc('roles_permissions').get();
        if (!doc.exists) {
            return NextResponse.json({});
        }
        return NextResponse.json(doc.data());
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        if (!db1) {
            return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
        }
        const body = await request.json();
        await db1.collection('settings').doc('roles_permissions').set({
            ...body,
            updated_at: new Date().toISOString()
        });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
