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

const app1 = getApp('gatepass', getCred('1'));
const app2 = getApp('iot', getCred('2'));

const checkUser = async (searchId) => {
    // Generate Candidates
    const emailsToCheck = [
        searchId.includes('@') ? searchId : null,
        !searchId.includes('@') ? `${searchId}@gatepass.com` : null,
        !searchId.includes('@') ? `${searchId}@ctgroup.in` : null,
        !searchId.includes('@') ? `${searchId}@system.local` : null,
        !searchId.includes('@') ? `PAR${searchId}@gatepass.com` : null, // Try prefix if missing
    ].filter(Boolean);

    console.log(`\n🔍 Checking User ID: ${searchId}`);
    console.log(`   Candidates: ${emailsToCheck.join(', ')}`);
    console.log('------------------------------------------------');

    for (const app of [app1, app2]) {
        const auth = getAuth(app);
        const db = getFirestore(app);
        const appName = app.name.toUpperCase();

        console.log(`\nChecking [${appName}] Project...`);

        for (const email of emailsToCheck) {
            try {
                const user = await auth.getUserByEmail(email);
                console.log(`✅ FOUND in Auth: ${email}`);
                console.log(`   - UID: ${user.uid}`);
                console.log(`   - Name: ${user.displayName}`);

                // Check Firestore
                const docRef = db.collection('users').doc(user.uid);
                const docSnap = await docRef.get();

                if (docSnap.exists) {
                    const d = docSnap.data();
                    console.log(`   ✅ FOUND in Firestore 'users'`);
                    console.log(`      - Role: ${d.role}`);
                    console.log(`      - Student ID: ${d.student_id}`);
                    console.log(`      - Emails: ${d.email}`);
                } else {
                    // Check web_admins
                    const waRef = db.collection('web_admins').doc(user.uid);
                    const waSnap = await waRef.get();
                    if (waSnap.exists) {
                        console.log(`   ✅ FOUND in 'web_admins'`);
                        console.log(`      - Role: ${waSnap.data().role}`);
                    } else {
                        console.log(`   ❌ Auth exists but missing in Firestore!`);
                    }
                }
            } catch (e) {
                if (e.code !== 'auth/user-not-found') {
                    console.log(`   Error checking ${email}: ${e.message}`);
                }
            }
        }
    }
    console.log('\n------------------------------------------------');
};

const targetId = process.argv[2] || '2201623';
checkUser(targetId);
