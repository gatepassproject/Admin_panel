const admin = require('firebase-admin');

// Using the same credentials from .env.local (I'll hardcode or read if possible)
// Since I can't read env easily in this script without dotenv, I'll just try to initialize with default
// Actually, I can read the file .env.local manually and extract them.

const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const projectId = env.match(/FIREBASE_PROJECT_ID=(.*)/)[1].trim();
const clientEmail = env.match(/FIREBASE_CLIENT_EMAIL=(.*)/)[1].trim();
const privateKey = env.match(/FIREBASE_PRIVATE_KEY="(.*)"/)[1].replace(/\\n/g, '\n');

admin.initializeApp({
    credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
    })
});

const db = admin.firestore();

async function run() {
    console.log(`Checking project: ${projectId}`);
    const snap = await db.collection('app_student').get();
    console.log(`Total docs in app_student: ${snap.size}`);
    snap.docs.forEach(doc => {
        const data = doc.data();
        console.log(`- [${doc.id}] ${data.full_name} | Dept: ${data.department} | Role: ${data.role}`);
    });
    process.exit(0);
}

run();
