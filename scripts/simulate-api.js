// Script to simulate API call logic (since we can't curl localhost easily in this env without port)
// We will reuse the logic from verify-connection.js but strictly follow the route.ts logic

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined;

admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    databaseURL: `https://${projectId}.firebaseio.com`
});

const db = admin.firestore();

async function simulateApiCall() {
    console.log('\n--- Simulating API Call for role=faculty ---');

    // Logic from api/users/route.ts
    const collectionName = 'app_faculty';
    const query = db.collection(collectionName);

    const snapshot = await query.get();

    // Apply the exact filtering logic we added
    const users = snapshot.docs
        .filter(doc => doc.id !== 'README')
        .map(doc => ({
            id: doc.id,
            uid: doc.id,
            ...doc.data()
        }));

    console.log(`Total Count: ${users.length}`);
    users.forEach((u, index) => {
        console.log(`${index + 1}. ID: ${u.id}, Name: ${u.full_name}`);
    });
}

simulateApiCall();
