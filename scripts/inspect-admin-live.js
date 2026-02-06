const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin (Reuse existing logic or simplified)
// We need to point to the correct project
const serviceAccountPath = path.join(__dirname, '.env.local'); // Hacky, better to just load env
require('dotenv').config({ path: '.env.local' });

if (!admin.apps.length) {
    try {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey,
            }),
            databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
        });
        console.log('Firebase Admin Initialized');
    } catch (error) {
        console.error('Init Error:', error);
        process.exit(1);
    }
}

const db = admin.firestore();

async function inspectAdmin() {
    console.log('--- Inspecting Admin Data ---');

    // We want to find the user that corresponds to "System Admin" / "Master Admin"
    // Usually this is the one with role 'admin'

    // 1. Check web_admins
    console.log('Querying web_admins for role=admin...');
    const snapshot = await db.collection('web_admins').where('role', '==', 'admin').get();

    if (snapshot.empty) {
        console.log('No admin found in web_admins collection.');
    } else {
        snapshot.forEach(doc => {
            console.log(`\nFound Admin (ID: ${doc.id}):`);
            console.log(JSON.stringify(doc.data(), null, 2));
        });
    }

    // 2. Check if there are other master_admins
    console.log('\nQuerying web_admins for role=master_admin...');
    const snapshot2 = await db.collection('web_admins').where('role', '==', 'master_admin').get();

    if (snapshot2.empty) {
        console.log('No master_admin found in web_admins collection.');
    } else {
        snapshot2.forEach(doc => {
            console.log(`\nFound Master Admin (ID: ${doc.id}):`);
            console.log(JSON.stringify(doc.data(), null, 2));
        });
    }

    console.log('\n--- End Inspection ---');
}

inspectAdmin().catch(console.error);
