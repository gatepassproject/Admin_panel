const admin = require('firebase-admin');

const config = {
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID_2,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL_2,
        privateKey: process.env.FIREBASE_PRIVATE_KEY_2?.replace(/\\n/g, '\n'),
    })
};

if (!admin.apps.length) {
    admin.initializeApp(config);
}

const db = admin.firestore();
const auth = admin.auth();

async function listUsers() {
    console.log('--- Project 2 Users ---');
    const snapshot = await db.collection('users').get();
    if (snapshot.empty) {
        console.log('No users found in Firestore.');
    } else {
        snapshot.forEach(doc => {
            const data = doc.data();
            console.log(`UID: ${doc.id} | Name: ${data.full_name} | Email: ${data.email} | Role: ${data.role}`);
        });
    }
}

listUsers().catch(err => {
    console.error('Error listing users:', err);
    process.exit(1);
});
