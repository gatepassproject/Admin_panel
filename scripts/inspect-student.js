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

async function checkStudentSchema() {
    console.log('\n--- Inspecting app_student Schema ---');
    try {
        const snapshot = await db.collection('app_student').limit(1).get();
        if (snapshot.empty) {
            console.log('Collection is empty.');
        } else {
            snapshot.forEach(doc => {
                console.log(`Doc ID: ${doc.id}`);
                console.log('Data:', JSON.stringify(doc.data(), null, 2));
            });
        }
    } catch (error) {
        console.error('Error fetching app_student:', error);
    }
    process.exit(0);
}

checkStudentSchema();
