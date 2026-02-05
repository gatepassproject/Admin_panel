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

async function checkOtherCollections() {
    console.log('\n--- Checking app_hod and app_principal ---');

    // Check HOD
    try {
        const hodSnapshot = await db.collection('app_hod').get();
        console.log(`\n[app_hod] Total: ${hodSnapshot.size}`);
        hodSnapshot.forEach(doc => {
            console.log(`  - ID: "${doc.id}" (Type: ${typeof doc.id})`);
            console.log(`    Data:`, JSON.stringify(doc.data()).substring(0, 100));
        });
    } catch (e) {
        console.error('Error in app_hod:', e);
    }

    // Check Principal
    try {
        const principalSnapshot = await db.collection('app_principal').get();
        console.log(`\n[app_principal] Total: ${principalSnapshot.size}`);
        principalSnapshot.forEach(doc => {
            console.log(`  - ID: "${doc.id}" (Type: ${typeof doc.id})`);
            console.log(`    Data:`, JSON.stringify(doc.data()).substring(0, 100));
        });
    } catch (e) {
        console.error('Error in app_principal:', e);
    }

    process.exit(0);
}

checkOtherCollections();
