const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const fs = require('fs');
const path = require('path');

// 1. Load .env.local manually
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, ...values] = line.split('=');
        if (key && values.length > 0) {
            const val = values.join('=').trim().replace(/^["']|["']$/g, '');
            process.env[key.trim()] = val;
        }
    });
} else {
    console.error("❌ .env.local not found!");
    process.exit(1);
}

// 2. Helper to get Credential Object
const getCred = (suffix) => ({
    projectId: process.env[`FIREBASE_PROJECT_ID_${suffix}`],
    clientEmail: process.env[`FIREBASE_CLIENT_EMAIL_${suffix}`],
    privateKey: process.env[`FIREBASE_PRIVATE_KEY_${suffix}`]?.replace(/\\n/g, '\n'),
});

function getApp(name, credentialConfig) {
    const apps = getApps();
    const existing = apps.find(a => a.name === name);
    if (existing) return existing;
    return initializeApp({ credential: cert(credentialConfig) }, name);
}

const app = getApp('gatepass', getCred('1'));
const auth = getAuth(app);
const db = getFirestore(app);

const cleanup = async () => {
    // IDs to check for cleanup: 2201616 (Incorrectly created parent), 2201623 (The correct one, delete to reset)
    const candidates = ['2201616@gatepass.com', '2201623@gatepass.com'];

    console.log('🧹 Cleaning up potential bad parent records...');

    for (const email of candidates) {
        try {
            const user = await auth.getUserByEmail(email);
            console.log(`Found ${email} (UID: ${user.uid}). Deleting...`);

            // Delete from Auth
            await auth.deleteUser(user.uid);

            // Delete from Firestore
            await db.collection('users').doc(user.uid).delete();
            console.log(`✅ Deleted ${email} completely.`);
        } catch (e) {
            if (e.code === 'auth/user-not-found') {
                console.log(`ℹ️ ${email} not found. Clean.`);
            } else {
                console.error(`❌ Error deleting ${email}:`, e.message);
            }
        }
    }
};

cleanup();
