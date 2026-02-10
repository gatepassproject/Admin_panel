
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

async function inspectData() {
    console.log(`Current Project: ${process.env.FIREBASE_PROJECT_ID}`);
    const collections = ['gate_passes', 'passes', 'requests'];

    for (const coll of collections) {
        console.log(`\n--- Inspecting Collection: ${coll} ---`);
        const snapshot = await db.collection(coll).limit(10).get();
        console.log(`Total found in limit(10): ${snapshot.size}`);
        if (snapshot.empty) {
            console.log('Collection is empty.');
            continue;
        }

        snapshot.forEach(doc => {
            console.log(`ID: ${doc.id}`);
            const data = doc.data();
            console.log('Fields:', Object.keys(data).join(', '));
            console.log('Preview:', JSON.stringify({
                name: data.full_name || data.student_name || data.visitor_name,
                dept: data.department || data.dept || data.branch || data.destination,
                status: data.status,
                out: data.exit_time || data.date || data.created_at,
                in: data.in_time || data.expected_return_time || data.actual_return_time
            }, null, 2));
        });
    }

    // Check specifically for CSE department passes
    console.log('\n--- Searching for CSE specific passes ---');
    const cseSnapshot = await db.collection('gate_passes').where('department', '==', 'CSE').limit(5).get();
    console.log(`Found ${cseSnapshot.size} passes with department == 'CSE'`);

    const cseFullSnapshot = await db.collection('gate_passes').where('department', '==', 'Computer Science Engineering').limit(5).get();
    console.log(`Found ${cseFullSnapshot.size} passes with department == 'Computer Science Engineering'`);
}

inspectData().catch(console.error);
