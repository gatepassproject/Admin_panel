const admin = require('firebase-admin');
const path = require('path');

const saPath = path.resolve(__dirname, '../backend/serviceAccountKey.json');
const serviceAccount = require(saPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

async function fixStudent2201619() {
    try {
        console.log('\n=== Fixing Student 2201619 ===\n');

        // Step 1: Find the student in app_student collection
        const studentsSnapshot = await db.collection('app_student').get();
        let studentDoc = null;
        let studentData = null;

        studentsSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.roll_no === '2201619' || data.roll_no === 2201619) {
                studentDoc = doc;
                studentData = data;
            }
        });

        if (!studentDoc) {
            console.log('❌ Student 2201619 not found in app_student collection');
            process.exit(1);
        }

        console.log('✅ Found student in app_student collection');
        console.log('   UID:', studentDoc.id);
        console.log('   Email:', studentData.email);
        console.log('   Roll No:', studentData.roll_no);
        console.log('   Full Name:', studentData.full_name);

        // Step 2: Check if entry exists in users collection
        const usersDoc = await db.collection('users').doc(studentDoc.id).get();

        if (usersDoc.exists()) {
            console.log('\n✅ Entry already exists in users collection');
        } else {
            console.log('\n⚠️  Creating missing entry in users collection...');

            // Create the "Source of Truth" entry
            const usersCollectionEntry = {
                uid: studentDoc.id,
                email: studentData.email,
                role: 'student',
                full_name: studentData.full_name,
                created_at: new Date().toISOString(),
            };

            await db.collection('users').doc(studentDoc.id).set(usersCollectionEntry);
            console.log('✅ Created entry in users collection');
        }

        // Step 3: Verify Firebase Auth
        try {
            const authUser = await auth.getUser(studentDoc.id);
            console.log('\n✅ Firebase Auth user exists');
            console.log('   Email:', authUser.email);
            console.log('   Display Name:', authUser.displayName);
        } catch (error) {
            console.log('\n❌ Firebase Auth user not found');
            console.log('   This student may need to be recreated via the admin panel');
        }

        console.log('\n✅ Migration complete! Student 2201619 should now be able to login.');
        console.log('\nLogin credentials:');
        console.log('   Roll Number: 2201619');
        console.log('   Password: password123');
        console.log('   Email (auto-generated): 2201619@ctgroup.in');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error:', error);
        process.exit(1);
    }
}

fixStudent2201619();
