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

async function checkMasterAdmin() {
    console.log('\n--- Checking User ---');
    const email = 'masteradmin.cse@ctgroup.in';
    try {
        // Check users collection
        const usersSnapshot = await db.collection('users').where('email', '==', email).get();
        if (!usersSnapshot.empty) {
            console.log(`Found in 'users':`);
            usersSnapshot.forEach(doc => {
                console.log('ID:', doc.id);
                console.log('Data:', JSON.stringify(doc.data(), null, 2));
            });
        } else {
            console.log("Not found in 'users' collection.");
        }

        // Check web_admins collection
        const webAdminsSnapshot = await db.collection('web_admins').where('email', '==', email).get();
        if (!webAdminsSnapshot.empty) {
            console.log(`Found in 'web_admins':`);
            webAdminsSnapshot.forEach(doc => {
                console.log('ID:', doc.id);
                console.log('Data:', JSON.stringify(doc.data(), null, 2));
            });
        } else {
            console.log("Not found in 'web_admins' collection.");
        }

    } catch (error) {
        console.error('Error fetching user:', error);
    }
    process.exit(0);
}

checkMasterAdmin();
