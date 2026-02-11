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

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
        databaseURL: `https://${projectId}.firebaseio.com`
    });
}

const db = admin.firestore();

async function inspectParents() {
    console.log('\n--- Inspecting "app_parent" Collection ---');
    try {
        const snapshot = await db.collection('app_parent').get();
        console.log(`Total Documents in 'app_parent': ${snapshot.size}`);

        snapshot.forEach(doc => {
            const data = doc.data();
            console.log(`\nDoc ID: ${doc.id}`);
            console.log('Full Name:', data.full_name);
            console.log('Profile Image Field:', data.profile_image);
            console.log('Profile Image Type:', typeof data.profile_image);
            console.log('All Keys:', Object.keys(data));
        });

    } catch (error) {
        console.error('Error fetching parents:', error);
    }
    process.exit(0);
}

inspectParents();
