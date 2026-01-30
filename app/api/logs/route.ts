import { NextResponse } from 'next/server';
import { db2 } from '@/lib/firebase-admin';

export async function GET(request: Request) {
    if (!db2) {
        return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const limitParam = searchParams.get('limit');
        const limit = limitParam ? parseInt(limitParam) : 50;

        // Fetch recent logs
        const snapshot = await db2.collection('gate_passes')
            .orderBy('created_at', 'desc')
            .limit(limit)
            .get();

        const logs = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                user: data.student_name || data.full_name || 'Unknown User',
                role: data.role || 'Student', // Default or fetch from user profile if needed
                gate: data.gate || 'Main Gate',
                type: (data.status === 'Outside' || data.status === 'Approved') ? 'Exit' : 'Entry', // Infer type
                time: new Date(data.updated_at || data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                date: new Date(data.updated_at || data.created_at).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }),
                status: data.status === 'Approved' ? 'Authorized' : data.status === 'Rejected' ? 'Denied' : data.status,
                // Raw timestamp for sorting if needed
                timestamp: data.updated_at || data.created_at
            };
        });

        return NextResponse.json({ logs });

    } catch (error: any) {
        console.error('Logs API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
