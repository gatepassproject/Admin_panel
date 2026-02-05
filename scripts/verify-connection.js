const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
console.log(`Loading env from: ${envPath}`);

if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
} else {
    console.error('Error: .env.local file not found!');
    process.exit(1);
}

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined;

console.log(`Configured Project ID: ${projectId}`);
console.log(`Configured Client Email: ${clientEmail}`);
// Don't log private key

if (!projectId || !clientEmail || !privateKey) {
    console.error('Missing necessary environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)');
    process.exit(1);
}

try {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
        }),
        databaseURL: `https://${projectId}.firebaseio.com`
    });

    console.log('Firebase Admin initialized.');
} catch (e) {
    console.error('Failed to initialize Firebase Admin:', e);
    process.exit(1);
}

const db = admin.firestore();

async function runCheck() {
    try {
        console.log('Attempting to list root collections...');
        const collections = await db.listCollections();
        console.log('Collections found:');
        if (collections.length === 0) console.log('  (None)');

        for (const col of collections) {
            console.log(`  - ${col.id}`);
        }

        console.log('\nChecking "app_student" collection...');
        const studentSnapshot = await db.collection('app_student').limit(5).get();
        if (studentSnapshot.empty) {
            console.log('  Collection "app_student" is empty or does not exist.');
        } else {
            console.log(`  Found ${studentSnapshot.size} documents in "app_student".`);
            studentSnapshot.forEach(doc => {
                console.log(`    Doc ID: ${doc.id}, Data snippet:`, JSON.stringify(doc.data()).substring(0, 100) + '...');
            });
        }

    } catch (error) {
        console.error('Error during database check:', error);
    }
}

runCheck();
