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

if (!projectId) {
    console.error('Missing credentials');
    process.exit(1);
}

admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    databaseURL: `https://${projectId}.firebaseio.com`
});

const db = admin.firestore();

async function inspectAlternativeCollections() {
    const collections = ['student_pass_requests', 'visitor_passes', 'gate_passes'];

    for (const collName of collections) {
        console.log(`\n--- Inspecting ${collName} ---`);
        try {
            const snapshot = await db.collection(collName).limit(3).get();
            if (!snapshot.empty) {
                snapshot.forEach(doc => {
                    console.log('ID:', doc.id);
                    console.log('Data:', JSON.stringify(doc.data(), null, 2));
                    console.log('---');
                });
            } else {
                console.log(`Collection '${collName}' is empty.`);
            }
        } catch (error) {
            console.error(`Error fetching from ${collName}:`, error);
        }
    }
    process.exit(0);
}

inspectAlternativeCollections();
