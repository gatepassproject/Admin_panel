const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from root or min-panel2
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

function getApp(name, config) {
    const existingApp = admin.apps.find(app => app?.name === name);
    if (existingApp) return existingApp;
    return admin.initializeApp(config, name);
}

const config1 = {
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID_1,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL_1,
        privateKey: process.env.FIREBASE_PRIVATE_KEY_1?.replace(/\\n/g, '\n'),
    })
};

const config2 = {
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID_2,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL_2,
        privateKey: process.env.FIREBASE_PRIVATE_KEY_2?.replace(/\\n/g, '\n'),
    })
};

async function diagnose() {
    const app1 = getApp('gatepass', config1);
    const app2 = getApp('iot', config2);

    const auth1 = admin.auth(app1);
    const db1 = admin.firestore(app1);

    console.log('--- Searching for "Dr. Sewa Singh" or "Singh@gmail.com" ---');

    // 1. Check Auth 1 for emails containing "singh"
    const listUsers = await auth1.listUsers(1000);
    const matches = listUsers.users.filter(u =>
        u.email?.toLowerCase().includes('singh') ||
        u.displayName?.toLowerCase().includes('sewa')
    );

    if (matches.length > 0) {
        console.log('Found matching users in Auth:');
        matches.forEach(u => console.log(` - UID: ${u.uid} | Email: ${u.email} | Name: ${u.displayName}`));
    } else {
        console.log('No matching users found in Auth.');
    }

    // 2. Check Firestore 1
    const snap = await db1.collection('users').get();
    const firestoreMatches = snap.docs.filter(d => {
        const data = d.data();
        return (data.full_name?.toLowerCase().includes('sewa')) ||
            (data.email?.toLowerCase().includes('singh')) ||
            (data.official_email?.toLowerCase().includes('singh'));
    });

    if (firestoreMatches.length > 0) {
        console.log('Found matching users in Firestore:');
        firestoreMatches.forEach(d => {
            const data = d.data();
            console.log(` - ID: ${d.id} | Name: ${data.full_name} | Role: ${data.role} | Email: ${data.email} | Official: ${data.official_email}`);
        });
    } else {
        console.log('No matching users found in Firestore.');
    }
}

diagnose().catch(err => console.error(err));
