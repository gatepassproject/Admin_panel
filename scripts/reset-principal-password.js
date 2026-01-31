const admin = require('firebase-admin');

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

async function resetPrincipalPassword() {
    try {
        const email = 'principal@gmail.com';
        const newPassword = '12345678';

        // Get user by email
        const user = await auth.getUserByEmail(email);
        console.log(`Found user: ${user.uid}`);

        // Update password
        await auth.updateUser(user.uid, {
            password: newPassword
        });

        console.log(`✅ Password updated successfully for ${email}`);
        console.log(`New password: ${newPassword}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

resetPrincipalPassword();
