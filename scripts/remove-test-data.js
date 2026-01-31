const admin = require('firebase-admin');

async function removeTestData() {
    const projects = [
        { id: process.env.FIREBASE_PROJECT_ID_1, email: process.env.FIREBASE_CLIENT_EMAIL_1, key: process.env.FIREBASE_PRIVATE_KEY_1, name: 'Project 1' },
        { id: process.env.FIREBASE_PROJECT_ID_2, email: process.env.FIREBASE_CLIENT_EMAIL_2, key: process.env.FIREBASE_PRIVATE_KEY_2, name: 'Project 2' }
    ];

    const emailsToKeep = [
        'masteradmin@gmail.com',
        'principal@gmail.com',
        'hod@gmail.com',
        'faculty@gmail.com'
    ];

    for (const p of projects) {
        console.log(`\nProcessing ${p.name} (${p.id})...`);
        const app = admin.initializeApp({
            credential: admin.credential.cert({
                projectId: p.id,
                clientEmail: p.email,
                privateKey: p.key?.replace(/\\n/g, '\n'),
            })
        }, p.name);

        const db = admin.firestore(app);
        const auth = admin.auth(app);

        const snapshot = await db.collection('users').get();
        if (snapshot.empty) {
            console.log(`No users found in ${p.name} Firestore.`);
        } else {
            for (const doc of snapshot.docs) {
                const data = doc.data();
                if (emailsToKeep.includes(data.email?.toLowerCase())) {
                    console.log(`Keeping: ${data.email}`);
                    continue;
                }

                console.log(`Deleting: ${data.email} (UID: ${doc.id})`);

                // 1. Delete from Auth
                try {
                    await auth.deleteUser(doc.id);
                } catch (e) {
                    if (e.code !== 'auth/user-not-found') {
                        console.error(`Error deleting ${doc.id} from Auth:`, e.message);
                    }
                }

                // 2. Delete from Firestore
                await db.collection('users').doc(doc.id).delete();
            }
        }
    }
    console.log('\nData removal completed.');
}

removeTestData().catch(err => {
    console.error('Critical Error:', err);
    process.exit(1);
});
