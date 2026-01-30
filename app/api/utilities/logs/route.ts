import { NextResponse } from 'next/server';
import { db2 } from '@/lib/firebase-admin';

export async function GET() {
    if (!db2) {
        return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }

    try {
        const snapshot = await db2.collection('admin_logs')
            .orderBy('timestamp', 'desc')
            .limit(50)
            .get();

        const logs = snapshot.docs.map(doc => {
            const data = doc.data();
            let type = 'Info';
            if (data.action && data.action.toLowerCase().includes('error')) type = 'Error';
            if (data.action && data.action.toLowerCase().includes('warning')) type = 'Warning';
            if (data.action && data.action.toLowerCase().includes('security')) type = 'Critical';

            // Format time relative like '5 mins ago' or just simple string for now
            const time = data.timestamp ? new Date(data.timestamp).toLocaleString() : 'Unknown';

            return {
                id: doc.id,
                type: type,
                source: 'System', // Could be inferred
                message: `${data.action}: ${data.details || ''}`,
                time: time
            };
        });

        return NextResponse.json({ logs });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
