
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

async function audit(id, email, key, label) {
    if (!id || !email || !key) return null;
    try {
        const app = admin.initializeApp({
            credential: admin.credential.cert({
                projectId: id,
                clientEmail: email,
                privateKey: key.replace(/\\n/g, '\n'),
            })
        }, label);
        const db = admin.firestore(app);

        const results = {};
        const collections = ['users', 'web_admins'];
        for (const c of collections) {
            const snap = await db.collection(c).get();
            results[c] = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
        return results;
    } catch (e) {
        console.error(`Audit error for ${label}:`, e.message);
        return null;
    }
}

async function run() {
    const p1 = await audit(env.FIREBASE_PROJECT_ID_1, env.FIREBASE_CLIENT_EMAIL_1, env.FIREBASE_PRIVATE_KEY_1, 'P1');
    const p2 = await audit(env.FIREBASE_PROJECT_ID_2, env.FIREBASE_CLIENT_EMAIL_2, env.FIREBASE_PRIVATE_KEY_2, 'P2');

    console.log('--- PROJECT 1 (GATEPASS) USERS ---');
    p1?.users?.forEach(u => console.log(`[P1-USERS] ${u.id} | ${u.full_name} | ${u.email} | ${u.role}`));

    console.log('\n--- PROJECT 2 (IOT) USERS (LEGACY?) ---');
    p2?.users?.forEach(u => console.log(`[P2-USERS] ${u.id} | ${u.full_name} | ${u.email} | ${u.role}`));

    console.log('\n--- PROJECT 2 (IOT) WEB_ADMINS ---');
    p2?.web_admins?.forEach(u => console.log(`[P2-WEB] ${u.id} | ${u.full_name} | ${u.email} | ${u.role}`));

    process.exit(0);
}

run();
