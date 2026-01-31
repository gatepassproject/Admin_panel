
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

function getEnv() {
    const envPath = path.join(__dirname, '..', '.env.local');
    const content = fs.readFileSync(envPath, 'utf8');
    const env = {};
    content.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
            let value = match[2] || '';
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.substring(1, value.length - 1);
            }
            env[match[1]] = value;
        }
    });
    return env;
}

const env = getEnv();

async function auditProject(id, email, key, label) {
    if (!id || !email || !key) {
        console.log(`[${label}] Missing configuration.`);
        return;
    }

    try {
        const app = admin.initializeApp({
            credential: admin.credential.cert({
                projectId: id,
                clientEmail: email,
                privateKey: key.replace(/\\n/g, '\n'),
            })
        }, label);

        const db = admin.firestore(app);
        console.log(`\n=== ${label} (${id}) ===`);

        const collections = await db.listCollections();
        console.log(`Collections: ${collections.map(c => c.id).join(', ')}`);

        for (const coll of collections) {
            const snapshot = await coll.limit(3).get();
            console.log(`\n  - ${coll.id} (Example Docs):`);
            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.password) data.password = '***';
                console.log(`    [${doc.id}] ${JSON.stringify(data).substring(0, 150)}...`);
            });
        }
    } catch (e) {
        console.log(`Error auditing ${label}: ${e.message}`);
    }
}

async function run() {
    await auditProject(env.FIREBASE_PROJECT_ID_1, env.FIREBASE_CLIENT_EMAIL_1, env.FIREBASE_PRIVATE_KEY_1, 'PROJECT_1_GATEPASS');
    await auditProject(env.FIREBASE_PROJECT_ID_2, env.FIREBASE_CLIENT_EMAIL_2, env.FIREBASE_PRIVATE_KEY_2, 'PROJECT_2_IOT');
    process.exit(0);
}

run();
