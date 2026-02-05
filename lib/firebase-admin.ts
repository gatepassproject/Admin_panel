import * as admin from 'firebase-admin';

// Re-use initialization logic for server environments
if (!admin.apps.length) {
    try {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;
        // Handle cases where private key might be quoted or have escaped newlines
        const formattedPrivateKey = privateKey ? privateKey.replace(/\\n/g, '\n') : undefined;

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: formattedPrivateKey,
            }),
            databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
        });
        console.log('✅ Firebase Admin Initialized in API Runtime');
    } catch (error) {
        console.error('❌ Firebase Admin Initialization Error:', error);
    }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();

// Legacy compatibility exports (Unified System)
export const db1 = adminDb; // Points to shared gatepass-49d43 Firestore
export const db2 = adminDb; // Points to shared gatepass-49d43 Firestore

/**
 * Professional Helper: Extract department from request cookies/context
 */
export function getDepartmentFromRequest(request: Request): string | null {
    try {
        const cookiesStr = request.headers.get('cookie') || '';
        const departmentCookie = cookiesStr
            .split('; ')
            .find(row => row.startsWith('user_department='));

        return departmentCookie ? departmentCookie.split('=')[1] : null;
    } catch (e) {
        console.error('⚠️ Failed to extract department from request headers:', e);
        return null;
    }
}
