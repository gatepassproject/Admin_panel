
const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

if (!admin.apps.length) {
    try {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;
        const formattedPrivateKey = privateKey ? privateKey.replace(/\\n/g, '\n') : undefined;

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: formattedPrivateKey,
            }),
            databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
        });
        console.log(`✅ Initialized default app for project: ${process.env.FIREBASE_PROJECT_ID}`);
    } catch (error) {
        console.error('❌ Init Error:', error);
        process.exit(1);
    }
}

const db = admin.firestore();

async function checkPasses() {
    console.log('Checking gate_passes collection...');
    try {
        const snapshot = await db.collection('gate_passes').orderBy('created_at', 'desc').limit(5).get();
        console.log(`Found ${snapshot.size} documents.`);
        if (snapshot.empty) {
            console.log('Collection is empty.');
        } else {
            snapshot.forEach(doc => {
                console.log('--- Document ID:', doc.id);
                console.log(doc.data());
            });
        }
    } catch (e) {
        console.error('Error querying gate_passes:', e);
    }
}

checkPasses();
