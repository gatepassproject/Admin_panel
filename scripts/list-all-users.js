const admin = require('firebase-admin');

async function listAll() {
    const projects = [
        { id: process.env.FIREBASE_PROJECT_ID_1, email: process.env.FIREBASE_CLIENT_EMAIL_1, key: process.env.FIREBASE_PRIVATE_KEY_1, name: 'Project 1' },
        { id: process.env.FIREBASE_PROJECT_ID_2, email: process.env.FIREBASE_CLIENT_EMAIL_2, key: process.env.FIREBASE_PRIVATE_KEY_2, name: 'Project 2' }
    ];

    for (const p of projects) {
        console.log(`\n--- ${p.name} (${p.id}) Users ---`);
        const app = admin.initializeApp({
            credential: admin.credential.cert({
                projectId: p.id,
                clientEmail: p.email,
                privateKey: p.key?.replace(/\\n/g, '\n'),
            })
        }, p.name);

        const db = admin.firestore(app);
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
}

listAll().catch(console.error);
