const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

if (!admin.apps.length) {
    try {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey,
            }),
            databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
        });
    } catch (error) {
        console.error('Init Error:', error);
        process.exit(1);
    }
}

const db = admin.firestore();

async function patchAdminProfiles() {
    console.log('--- Patching Admin Profiles ---');

    // Update all users with role 'admin' in web_admins
    const snapshot = await db.collection('web_admins').where('role', '==', 'admin').get();

    if (snapshot.empty) {
        console.log('No admins found to patch.');
        return;
    }

    const updates = [];
    snapshot.forEach(doc => {
        const data = doc.data();
        const updateData = {};
        let needsUpdate = false;

        if (!data.designation) {
            updateData.designation = 'System Administrator';
            needsUpdate = true;
        }
        if (!data.department_name) {
            updateData.department_name = 'Campus Headquarters';
            needsUpdate = true;
        }
        if (!data.phone) {
            updateData.phone = '+91 98765 43210';
            needsUpdate = true;
        }

        if (needsUpdate) {
            updates.push(db.collection('web_admins').doc(doc.id).update(updateData));
            console.log(`Patching Admin ${doc.id} (${data.full_name || 'No Name'})...`);
        } else {
            console.log(`Admin ${doc.id} already has complete profile.`);
        }
    });

    await Promise.all(updates);
    console.log(`--- Patched ${updates.length} admin profiles ---`);
}

patchAdminProfiles().catch(console.error);
