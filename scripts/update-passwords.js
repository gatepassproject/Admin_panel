const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin using service account file directly for reliability
const serviceAccountPath = path.resolve(__dirname, '../../backend/serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

console.log(`📍 Project ID: ${serviceAccount.project_id}`);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

console.log(`📱 Apps initialized: ${admin.apps.length}`);

const db = admin.firestore();

async function updateAllPasswords() {
    console.log('🚀 Starting Web Admin Password Update...');
    console.log(`📍 Project: ${serviceAccount.project_id}`);

    try {
        // 1. Get all collections
        const collections = await db.listCollections();
        const adminCollections = collections.filter(c => c.id.startsWith('web_admins'));

        console.log(`📂 Found ${adminCollections.length} admin collections.`);

        for (const collection of adminCollections) {
            console.log(`\n🔍 Processing collection: ${collection.id}`);
            const snapshot = await collection.get();

            if (snapshot.empty) {
                console.log('   Empty collection, skipping.');
                continue;
            }

            const batch = db.batch();
            let updateCount = 0;

            snapshot.forEach(doc => {
                const data = doc.data();
                const role = data.role || '';
                const email = data.email || '';
                const dept = data.department || data.dept || '';
                let password = 'Password123!'; // Default for staff

                // Determine password based on role
                if (role === 'admin' || email === 'masteradmin@gmail.com' || email === 'principal@gmail.com') {
                    password = 'Admin@123';
                } else if (role === 'master_admin' || role === 'admin') {
                    // Try to get dept from collection name if not in document
                    const deptMatch = collection.id.match(/web_admins_(.+)/);
                    const actualDept = dept || (deptMatch ? deptMatch[1] : '');

                    if (actualDept && role === 'master_admin') {
                        password = `MasterAdmin@${actualDept.toUpperCase()}123`;
                    } else if (role === 'admin') {
                        password = 'Admin@123';
                    }
                }

                batch.update(doc.ref, {
                    password: password,
                    updated_at: new Date().toISOString()
                });
                updateCount++;
                console.log(`   ✅ Prepared update for: ${email.padEnd(30)} | Role: ${role.padEnd(12)} | Pwd: ${password}`);
            });

            await batch.commit();
            console.log(`   ✨ Committed updates for ${updateCount} documents in ${collection.id}`);
        }

        console.log('\n✅ All collections processed successfully!');

    } catch (error) {
        console.error('💥 Fatal error:', error);
    } finally {
        process.exit(0);
    }
}

updateAllPasswords();
