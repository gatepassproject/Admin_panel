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

const TARGET_EMAIL = 'masteradmin.cse@ctgroup.in';

async function findUser() {
    console.log(`--- Searching for Email: ${TARGET_EMAIL} ---`);

    // Get all collections
    const collections = await db.listCollections();

    for (const col of collections) {
        const snapshot = await col.where('email', '==', TARGET_EMAIL).get();

        if (!snapshot.empty) {
            snapshot.forEach(doc => {
                console.log(`\n✅ FOUND in collection: '${col.id}' (ID: ${doc.id})`);
                console.log(JSON.stringify(doc.data(), null, 2));
            });
        }
    }

    console.log('\n--- Search Complete ---');
}

findUser().catch(console.error);
