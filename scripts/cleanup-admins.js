/**
 * Cleanup Script for Web Admins
 * Deletes all administrative data from Firestore and Auth to allow for a clean re-seed with new IDs.
 */

const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = path.resolve(__dirname, '../../backend/serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const auth = admin.auth();
const db = admin.firestore();

async function deleteCollection(collectionPath, batchSize = 100) {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(query, resolve).catch(reject);
    });
}

async function deleteQueryBatch(query, resolve) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
        resolve();
        return;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    process.nextTick(() => {
        deleteQueryBatch(query, resolve);
    });
}

async function cleanup() {
    console.log('🧹 Starting Web Admin Cleanup...');

    // 1. Find all collections starting with 'web_admins'
    // Note: listCollections() only works in server environments, but here we can manually specify or try to discover.
    // For this project, we know the pattern.
    const collectionsToDelete = [
        'web_admins',
        'web_admins_CSE',
        'web_admins_ECE',
        'web_admins_ME',
        'web_admins_CE',
        'web_admins_EE',
        'web_admins_AI_ML',
        'web_admins_BT',
        'web_admins_APPLIED_SCI',
        'web_admins_IOT',
        'web_admins_TECH',
        'web_admins_WEB_TECH',
        'web_admins_BM',
        'web_admins_ARCH',
        'web_admins_INTERIOR',
        'web_admins_PHARM',
        'web_admins_PHARMA_SCI',
        'web_admins_MED_LAB',
        'web_admins_PHYSIOTHERAPY',
        'web_admins_LAW',
        'web_admins_HUMANITIES',
        'web_admins_HOTEL',
        'web_admins_TOURISM',
        'web_admins_EDUCATION',
        'web_admins_MULTIMEDIA'
    ];

    for (const col of collectionsToDelete) {
        console.log(`   Deleting collection: ${col}...`);
        await deleteCollection(col);
    }

    // 2. Delete Auth Users
    // This is safer by email list or we can try to list users and delete if they match our patterns.
    // However, since we are re-seeding everything, let's just delete the ones we know about.
    console.log('\n🔐 Deleting Auth Users (by known emails)...');

    // We'll collect emails from our data (sharing logic with seed script)
    // For now, let's just delete users with @gmail.com (test) or @ctgroup.in
    const users = await auth.listUsers(1000);
    let deletedCount = 0;

    for (const user of users.users) {
        if (user.email && (user.email.endsWith('@ctgroup.in') || user.email.includes('principal@gmail.com') || user.email.includes('masteradmin@gmail.com') || user.email.includes('faculty@gmail.com') || user.email.includes('hod@gmail.com'))) {
            await auth.deleteUser(user.uid);
            deletedCount++;
        }
    }

    console.log(`   Deleted ${deletedCount} Auth users.`);
    console.log('\n✨ Cleanup complete!');
    process.exit(0);
}

cleanup().catch(err => {
    console.error('💥 Cleanup failed:', err);
    process.exit(1);
});
