import admin from 'firebase-admin';

// Load variables is handled by node --env-file=.env.local

const config = {
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID_1,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL_1,
        privateKey: process.env.FIREBASE_PRIVATE_KEY_1?.replace(/\\n/g, '\n'),
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID_1}.firebaseio.com`
};

if (!admin.apps.length) {
    admin.initializeApp(config);
}

const auth = admin.auth();
const db = admin.firestore();

const email = 'faculty@gmail.com';
const password = 'paasword123';
const fullName = 'Faculty User';
const role = 'faculty';
const department = 'Computer Science';

async function createAdmin() {
    try {
        console.log(`Checking if user ${email} exists...`);
        let userRecord;
        try {
            userRecord = await auth.getUserByEmail(email);
            console.log('User already exists. Updating password...');
            await auth.updateUser(userRecord.uid, {
                password: password,
                displayName: fullName
            });
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                console.log('Creating new user...');
                userRecord = await auth.createUser({
                    email: email,
                    password: password,
                    displayName: fullName,
                });
            } else {
                throw error;
            }
        }

        console.log(`User created/updated with UID: ${userRecord.uid}`);

        const userData = {
            uid: userRecord.uid,
            email: email,
            full_name: fullName,
            role: role,
            department: department,
            status: 'Inside',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        console.log('Setting Firestore document...');
        await db.collection('users').doc(userRecord.uid).set(userData, { merge: true });

        console.log(`${role.toUpperCase()} created successfully!`);
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();
