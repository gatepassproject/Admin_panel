const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID || 'gatepass-49d43',
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
        }),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID || 'gatepass-49d43'}.firebaseio.com`
    });
}

const db = admin.firestore();

async function addSecurityData() {
    try {
        // Add SEC001 with password123 to app_security collection
        await db.collection('app_security').doc('SEC001').set({
            username: 'SEC001',
            password: 'password123',
            role: 'security',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log('✅ Security data added successfully!');
        console.log('Document ID: SEC001');
        console.log('Collection: app_security');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding security data:', error);
        process.exit(1);
    }
}

addSecurityData();
