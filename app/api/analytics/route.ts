import { NextResponse } from 'next/server';
import { db2 } from '@/lib/firebase-admin';

export async function GET() {
    if (!db2) {
        return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }

    try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Fetch logs/passes for the last 30 days
        const snapshot = await db2.collection('gate_passes')
            .where('created_at', '>=', thirtyDaysAgo.toISOString())
            .get();

        const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 1. Traffic Data (Last 7 days)
        const trafficMap = new Map();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayName = days[d.getDay()];
            trafficMap.set(dayName, { name: dayName, entries: 0, exits: 0 });
        }

        logs.forEach((log: any) => {
            const date = new Date(log.created_at || log.timestamp);
            const dayName = days[date.getDay()];
            if (trafficMap.has(dayName)) {
                // Heuristic: If status is 'Approved'/'Outside', count as Exit. If 'Returned'/'Inside', count as Entry.
                // For now, since we might only have requests, we'll treat 'Approved' as Exit.
                // If there's a separate 'return_time', we count that as Entry.
                if (log.status === 'Approved' || log.status === 'Outside') {
                    trafficMap.get(dayName).exits += 1;
                }
                if (log.status === 'Returned' || log.status === 'Inside') {
                    trafficMap.get(dayName).entries += 1;
                    // Also count the original exit if we can, but simpler to just count based on status presence?
                    // Actually, 'Returned' implies they exited and came back.
                }
            }
        });

        const trafficData = Array.from(trafficMap.values());

        // 2. Peak Hours
        const hoursMap = new Array(24).fill(0);
        logs.forEach((log: any) => {
            const date = new Date(log.created_at);
            const hour = date.getHours();
            hoursMap[hour]++;
        });

        // Sample down to every 2 hours for the chart
        const peakHoursData = [];
        for (let i = 8; i <= 20; i += 2) {
            const load = hoursMap[i] + hoursMap[i + 1]; // Sum 2 hours
            peakHoursData.push({
                hour: `${i.toString().padStart(2, '0')}:00`,
                load: load > 100 ? 100 : load // Normalize slightly or keep raw
            });
        }

        // 3. Pass Type Distribution
        const typeMap: any = {};
        logs.forEach((log: any) => {
            const type = log.purpose || log.pass_type || 'General';
            typeMap[type] = (typeMap[type] || 0) + 1;
        });

        const passTypeData = Object.keys(typeMap).map((name, idx) => ({
            name,
            value: typeMap[name],
            color: ['#1e3a5f', '#c32026', '#fec20f', '#64748b'][idx % 4]
        }));

        // 4. Metrics
        const totalVisits = logs.length;
        const uniqueVisitors = new Set(logs.map((l: any) => l.student_id || l.uid)).size;

        return NextResponse.json({
            trafficData,
            peakHoursData,
            passTypeData,
            metrics: {
                totalVisits,
                uniqueVisitors,
                avgStayTime: '4.2h' // Placeholder calculation
            }
        });

    } catch (error: any) {
        console.error('Analytics API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
