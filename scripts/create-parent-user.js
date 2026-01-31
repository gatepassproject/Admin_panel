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

// Use Project 1 (Mobile App) for Parents
const app = getApp('gatepass', getCred('1'));
const auth = getAuth(app);
const db = getFirestore(app);

const createParent = async () => {
    const studentId = '2201623'; // The ID the user is trying to use
    const email = `${studentId}@gatepass.com`;
    const password = 'password123';

    console.log(`Creating/Updating Parent: ${email}`);

    try {
        // 1. Create or Get Auth User
        let uid;
        try {
            const user = await auth.getUserByEmail(email);
            uid = user.uid;
            console.log('User already exists in Auth, updating password...');
            await auth.updateUser(uid, { password: password });
        } catch (e) {
            if (e.code === 'auth/user-not-found') {
                console.log('Creating new Auth user...');
                const user = await auth.createUser({
                    email: email,
                    password: password,
                    displayName: 'Parent User'
                });
                uid = user.uid;
            } else {
                throw e;
            }
        }

        // 2. Create Firestore Profile
        console.log(`Updating Firestore for UID: ${uid}`);
        await db.collection('users').doc(uid).set({
            uid: uid,
            full_name: 'Parent User',
            email: email,
            role: 'parent',
            student_id: 'CS2023089', // Example linked student
            phone: '9876543210',
            gender: 'Male',
            relation: 'Father',
            created_at: new Date().toISOString(),
            status: 'Active'
        }, { merge: true });

        console.log('✅ Parent Created Successfully!');
        console.log(`👉 Login ID: ${studentId}`);
        console.log(`👉 Password: ${password}`);

    } catch (error) {
        console.error('❌ Error creating parent:', error);
    }
};

createParent();
