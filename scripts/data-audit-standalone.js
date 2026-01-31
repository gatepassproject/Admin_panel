
const admin = require('firebase-admin');

// Load environment variables directly if needed, but assuming they are available in the environment
const p1Id = process.env.FIREBASE_PROJECT_ID_1;
const p1Email = process.env.FIREBASE_CLIENT_EMAIL_1;
const p1Key = process.env.FIREBASE_PRIVATE_KEY_1;

const p2Id = process.env.FIREBASE_PROJECT_ID_2;
const p2Email = process.env.FIREBASE_CLIENT_EMAIL_2;
const p2Key = process.env.FIREBASE_PRIVATE_KEY_2;

async function auditProject(id, email, key, label) {
    if (!id || !email || !key) {
        console.log(`[${label}] Missing configuration for this project.`);
        return;
    }

    const app = admin.initializeApp({
        credential: admin.credential.cert({
            projectId: id,
            clientEmail: email,
            privateKey: key.replace(/\\n/g, '\n'),
        })
    }, label);

    const db = admin.firestore(app);
    console.log(`\n=== AUDITING ${label} (${id}) ===`);

    try {
        const collections = await db.listCollections();
        console.log(`Collections found: ${collections.map(c => c.id).join(', ')}`);

        for (const coll of collections) {
            const snapshot = await coll.limit(5).get();
            console.log(`\n  --- Collection: ${coll.id} (Total docs: ~${snapshot.size}) ---`);
            snapshot.forEach(doc => {
                const data = doc.data();
                // Mask sensitive info
                if (data.password) data.password = '********';
                console.log(`  [ID: ${doc.id}]`, JSON.stringify(data).substring(0, 200) + (JSON.stringify(data).length > 200 ? '...' : ''));
            });
        }
    } catch (e) {
        console.error(`Error auditing ${label}:`, e.message);
    }
}

async function run() {
    await auditProject(p1Id, p1Email, p1Key, 'PROJECT_1_APP');
    await auditProject(p2Id, p2Email, p2Key, 'PROJECT_2_WEB');
    process.exit(0);
}

run();
