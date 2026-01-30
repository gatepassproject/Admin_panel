import { NextResponse } from 'next/server';
import { db2 } from '@/lib/firebase-admin';

export async function POST(request: Request) {
    if (!db2) {
        return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { message, target, channels, scheduledTime } = body;

        if (!message || message.length < 5) {
            return NextResponse.json({ error: 'Message payload is too short or missing.' }, { status: 400 });
        }

        // Create broadcast record
        const broadcastDoc = await db2.collection('broadcasts').add({
            title: body.title || 'Campus Announcement',
            message: message,
            targetAudience: target || 'All',
            channels: channels || ['push'],
            status: scheduledTime ? 'Scheduled' : 'Sent',
            scheduledTime: scheduledTime ? new Date(scheduledTime) : null,
            sentAt: scheduledTime ? null : new Date(),
            recipientsCount: 0, // In real app, calculate this
            successCount: 0,
            admin: 'System Admin' // Replace with auth user
        });

        // If 'Sent', we would trigger notifications here. 
        // For 'proper working' simulation, we'll just add to admin logs that it was queued.
        await db2.collection('admin_logs').add({
            action: 'Broadcast Dispatch',
            details: `Sent "${body.title}" to ${target}`,
            timestamp: new Date().toISOString()
        });

        return NextResponse.json({ success: true, id: broadcastDoc.id });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    if (!db2) {
        return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }

    try {
        const snapshot = await db2.collection('broadcasts')
            .orderBy('sentAt', 'desc')
            .limit(10)
            .get();

        const broadcasts = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                message: data.message,
                time: data.sentAt ? new Date(data.sentAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Scheduled',
                date: data.sentAt ? new Date(data.sentAt.toDate()).toLocaleDateString() : '',
                recipients: data.targetAudience,
                status: data.status
            };
        });

        return NextResponse.json({ broadcasts });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
