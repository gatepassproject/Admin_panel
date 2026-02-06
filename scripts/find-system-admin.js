const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

if (!admin.apps.length) {
    try {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey,
            }),
            databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
        });
    } catch (error) {
        console.error('Init Error:', error);
        process.exit(1);
    }
}

const db = admin.firestore();

async function findSystemAdmin() {
    console.log('--- Searching for System Admin ---');

    // Try to find by full_name "System Admin" or "Master Admin" which is likely the one
    // or by role 'admin'

    const snapshot = await db.collection('web_admins').get();
    let found = false;

    snapshot.forEach(doc => {
        const data = doc.data();
        if (data.role === 'admin' || data.full_name === 'System Admin' || data.full_name === 'Master Administrator') {
            console.log(`\nPotential Match (ID: ${doc.id}):`);
            console.log(JSON.stringify(data, null, 2));
            found = true;
        }
    });

    if (!found) {
        console.log('No user with role "admin" or name "System Admin" found in web_admins.');
    }
}

findSystemAdmin().catch(console.error);
