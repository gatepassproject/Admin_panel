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

async function checkUsersForFaculty() {
    console.log('\n--- Checking "users" Collection for Faculty ---');
    try {
        const snapshot = await db.collection('users').get();
        console.log(`Total Documents in 'users': ${snapshot.size}`);

        let facultyCount = 0;
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.role === 'faculty') {
                facultyCount++;
                console.log(`\nFound Faculty in 'users':`);
                console.log(`Doc ID: ${doc.id}`);
                console.log('Data:', JSON.stringify(data, null, 2));
            }
        });

        if (facultyCount === 0) {
            console.log('No faculty found in "users" collection.');
        } else {
            console.log(`\nFound ${facultyCount} faculty documents in 'users' collection.`);
        }

    } catch (error) {
        console.error('Error fetching users:', error);
    }
    process.exit(0);
}

checkUsersForFaculty();
