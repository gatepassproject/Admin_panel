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

async function migrateFaculty() {
    console.log('\n--- Migrating Faculty from "users" to "app_faculty" ---');
    try {
        const usersSnapshot = await db.collection('users').where('role', '==', 'faculty').get();
        console.log(`Found ${usersSnapshot.size} faculty in "users" collection.`);

        if (usersSnapshot.empty) {
            console.log('No faculty to migrate.');
            process.exit(0);
        }

        let migratedCount = 0;
        let skippedCount = 0;

        for (const doc of usersSnapshot.docs) {
            const userData = doc.data();
            const uid = doc.id;

            // Check if already exists in app_faculty
            const targetDoc = await db.collection('app_faculty').doc(uid).get();

            if (targetDoc.exists) {
                console.log(`[SKIP] Faculty ${uid} already exists in app_faculty.`);
                skippedCount++;
            } else {
                console.log(`[MIGRATE] Copying ${uid} (${userData.full_name || 'No Name'}) to app_faculty...`);
                await db.collection('app_faculty').doc(uid).set(userData);
                migratedCount++;
            }
        }

        console.log('\nMigration Complete.');
        console.log(`Migrated: ${migratedCount}`);
        console.log(`Skipped (Already Existed): ${skippedCount}`);

    } catch (error) {
        console.error('Error during migration:', error);
    }
    process.exit(0);
}

migrateFaculty();
