
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

async function findKashish() {
    console.log('Searching for Kashish Singh in gate_passes...');
    const snapshot = await db.collection('gate_passes').get();
    let count = 0;
    snapshot.forEach(doc => {
        const data = doc.data();
        const name = (data.full_name || data.student_name || data.visitor_name || '').toLowerCase();
        if (name.includes('kashish')) {
            console.log(`\nID: ${doc.id}`);
            console.log(JSON.stringify(data, null, 2));
            count++;
        }
    });
    console.log(`\nTotal found: ${count}`);
}

findKashish().catch(console.error);
