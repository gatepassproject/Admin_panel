import { NextResponse } from 'next/server';
import { db2 } from '@/lib/firebase-admin';

export async function GET() {
    if (!db2) {
        return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }

    try {
        const doc = await db2.collection('system_settings').doc('global').get();
        if (!doc.exists) {
            // Return defaults if not configured
            return NextResponse.json({
                general: {
                    institutionName: 'CT Group of Institutions',
                    shortName: 'CT GROUP',
                    campusCategory: 'University Campus',
                    openTime: '06:00',
                    closeTime: '23:00',
                    weekendOpenTime: '08:00',
                    weekendCloseTime: '21:00',
                    adminEmail: 'admin@ctgroup.in',
                    helpline: '+91 181 5055127',
                    address: 'CT Group of Institutions, Shahpur, Near Lambra, Nakodar Road, Jalandhar, Punjab 144020'
                },
                notifications: {
                    passApprovalPush: true,
                    passApprovalSms: false,
                    passApprovalEmail: true,
                    lateReturnAlertPush: true,
                    lateReturnAlertSms: true,
                    lateReturnAlertEmail: true,
                    systemAlertPush: true,
                    systemAlertEmail: true,
                    securityBreachPush: true,
                    securityBreachSms: true,
                },
                security: {
                    mfaEnabled: true,
                    sessionTimeout: 30,
                    enforceStrongPasswords: true,
                    logAllAdminActions: true,
                    autoLockOnIdle: true,
                    ipRestriction: false,
                }
            });
        }
        return NextResponse.json(doc.data());
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!db2) {
        return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { section, data } = body;

        if (!section || !data) {
            return NextResponse.json({ error: 'Missing section or data' }, { status: 400 });
        }

        // Update specific section using dot notation for specific field update
        // or just merge the object map
        await db2.collection('system_settings').doc('global').set({
            [section]: data
        }, { merge: true });

        // Also log this action
        await db2.collection('admin_logs').add({
            action: `Updated ${section} settings`,
            admin: 'Current Admin', // In real app, get from auth context
            timestamp: new Date().toISOString()
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
