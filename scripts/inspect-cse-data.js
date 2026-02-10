
const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        })
    });
}

const db = admin.firestore();

async function inspectCSE() {
    console.log('--- Inspecting Computer Science Engineering Passes ---');
    const snapshot = await db.collection('gate_passes')
        .where('department', '==', 'Computer Science Engineering')
        .limit(10)
        .get();

    if (snapshot.empty) {
        console.log('No matches found.');
        return;
    }

    snapshot.forEach(doc => {
        console.log(`\nID: ${doc.id}`);
        console.log(JSON.stringify(doc.data(), null, 2));
    });
}

inspectCSE().catch(console.error);
