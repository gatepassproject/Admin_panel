const admin = require('firebase-admin');

// Config for Project 2 (Web Admin Panel)
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

const auth = admin.auth();
const db = admin.firestore();

async function verifyLoginState() {
    const email = 'principal@gmail.com';
    console.log(`\n🔍 Verifying Web Login State for: ${email}`);
    console.log(`Checking Project 2: ${process.env.FIREBASE_PROJECT_ID_2}`);

    try {
        // 1. Check Auth
        const user = await auth.getUserByEmail(email);
        console.log(`\n✅ Auth User Found:`);
        console.log(`   - UID: ${user.uid}`);
        console.log(`   - Email: ${user.email}`);

        // 2. Check Firestore (web_admins)
        console.log(`\nChecking Firestore collection 'web_admins'...`);
        const docRef = db.collection('web_admins').doc(user.uid);
        const doc = await docRef.get();

        if (doc.exists) {
            console.log(`✅ Firestore Profile Found in 'web_admins':`);
            console.log(`   - Role: ${doc.data().role}`);
            console.log(`   - Name: ${doc.data().full_name}`);
        } else {
            console.error(`❌ Firestore Profile MISSING in 'web_admins' collection!`);
            console.log(`   The login page expects a document at web_admins/${user.uid}`);
        }

    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            console.error(`❌ User NOT FOUND in Project 2 Auth!`);
        } else {
            console.error('❌ Error:', error);
        }
    }
}

verifyLoginState();
