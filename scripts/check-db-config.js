const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
} else {
    console.error('Error: .env.local file not found!');
    process.exit(1);
}

// Function to initialize app and check DB
async function checkProject(name, idKey, emailKey, keyKey) {
    console.log(`\n--- Checking Project: ${name} ---`);
    const projectId = process.env[idKey];
    const clientEmail = process.env[emailKey];
    // Handle private key newlines
    const privateKey = process.env[keyKey] ? process.env[keyKey].replace(/\\n/g, '\n') : undefined;

    console.log(`Project ID (${idKey}): ${projectId}`);

    if (!projectId || !clientEmail || !privateKey) {
        console.error('MISSING CREDENTIALS in .env.local');
        return;
    }

    try {
        const app = admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
            databaseURL: `https://${projectId}.firebaseio.com`
        }, name);

        const db = admin.firestore(app);
        const collections = await db.listCollections();

        console.log(`Successfully connected to ${projectId}`);
        console.log(`Root Collections:`);
        if (collections.length === 0) {
            console.log('  (Allowed empty if fresh DB)');
        }
        for (const col of collections) {
            console.log(`  - ${col.id}`);
            // Count docs (limit 1) to verify access
            const snap = await col.limit(1).get();
            console.log(`    (Contains data: ${!snap.empty})`);
        }

    } catch (error) {
        console.error(`FAILED to connect to ${name}:`, error.message);
    }
}

async function run() {
    console.log('Starting Database Check...');

    // Check Project 1 (GatePass)
    await checkProject('Project 1 (Mobile/GatePass)', 'FIREBASE_PROJECT_ID_1', 'FIREBASE_CLIENT_EMAIL_1', 'FIREBASE_PRIVATE_KEY_1');

    // Check Project 2 (Web/IoT)
    await checkProject('Project 2 (Web/IoT)', 'FIREBASE_PROJECT_ID_2', 'FIREBASE_CLIENT_EMAIL_2', 'FIREBASE_PRIVATE_KEY_2');

    console.log('\nDone.');
    process.exit(0);
}

run();
