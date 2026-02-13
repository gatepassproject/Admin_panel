import * as admin from 'firebase-admin';

// Re-use initialization logic for server environments
function initializeAdmin() {
    if (admin.apps.length > 0) return admin.app();

    try {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;
        // Handle cases where private key might be quoted or have escaped newlines
        const formattedPrivateKey = privateKey
            ? privateKey.replace(/\\n/g, '\n').replace(/^"(.*)"$/, '$1')
            : undefined;

        if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !formattedPrivateKey) {
            console.warn('⚠️ Firebase Admin Environment Variables Missing. Some services may fail.');
            return null;
        }

        return admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: formattedPrivateKey,
            }),
            databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
        });
    } catch (error) {
        console.error('❌ Firebase Admin Initialization Error:', error);
        return null;
    }
}

const app = initializeAdmin();

export const adminAuth = app ? app.auth() : {} as admin.auth.Auth;
export const adminDb = app ? app.firestore() : {} as admin.firestore.Firestore;

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
