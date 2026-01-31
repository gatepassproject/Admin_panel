
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

async function getDB(id, email, key, label) {
    if (!id || !email || !key) return null;
    const app = admin.initializeApp({
        credential: admin.credential.cert({
            projectId: id,
            clientEmail: email,
            privateKey: key.replace(/\\n/g, '\n'),
        })
    }, label);
    return admin.firestore(app);
}

async function cleanup() {
    const db1 = await getDB(env.FIREBASE_PROJECT_ID_1, env.FIREBASE_CLIENT_EMAIL_1, env.FIREBASE_PRIVATE_KEY_1, 'P1');
    const db2 = await getDB(env.FIREBASE_PROJECT_ID_2, env.FIREBASE_CLIENT_EMAIL_2, env.FIREBASE_PRIVATE_KEY_2, 'P2');

    // These users are considered 'Web Data' because they exist in web_admins (Project 2)
    // We want to remove them from Project 1 (App DB) to ensure strict isolation.
    const webEmails = [
        'masteradmin@gmail.com',
        'principal@gmail.com',
        'faculty@gmail.com',
        'hod@gmail.com'
    ];

    console.log('--- Cleaning up Project 1 (Mobile App DB) ---');
    if (db1) {
        const p1Users = await db1.collection('users').get();
        for (const doc of p1Users.docs) {
            const data = doc.data();
            if (webEmails.includes(data.email?.toLowerCase())) {
                console.log(`[P1] Deleting web admin duplicate: ${data.email} (${doc.id})`);
                await doc.ref.delete();
            }
        }
    }

    console.log('\n--- Cleaning up Project 2 (IoT/Web DB) Legacy users collection ---');
    if (db2) {
        // Project 2 should only use 'web_admins' collection. 
        // Any data in 'users' collection in P2 is legacy/duplicate.
        const p2LegacyUsers = await db2.collection('users').get();
        for (const doc of p2LegacyUsers.docs) {
            console.log(`[P2] Deleting legacy/duplicate user: ${doc.data().email} (${doc.id})`);
            await doc.ref.delete();
        }
    }

    console.log('\nCleanup Complete. Project 1 now only contains App data. Project 2 contains Web Admin data in web_admins.');
    process.exit(0);
}

cleanup();
