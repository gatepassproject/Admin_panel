// Quick test script to verify Firebase collection access
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = path.resolve(__dirname, '../backend/serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function testCollections() {
    console.log('\n=== Testing Firebase Collections ===\n');

    // Test app_student collection
    console.log('1. Checking app_student collection...');
    const studentsSnapshot = await db.collection('app_student').limit(3).get();
    console.log(`   Found ${studentsSnapshot.size} students (showing first 3)`);
    studentsSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`   - ${data.full_name || data.name} (${data.email || 'no email'})`);
    });

    // Get total count
    const allStudents = await db.collection('app_student').get();
    console.log(`   Total students in app_student: ${allStudents.size}`);

    // Test app_faculty collection
    console.log('\n2. Checking app_faculty collection...');
    const facultySnapshot = await db.collection('app_faculty').limit(3).get();
    console.log(`   Found ${facultySnapshot.size} faculty (showing first 3)`);
    facultySnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`   - ${data.full_name || data.name} (${data.email || 'no email'})`);
    });

    // Test old users collection (if it exists)
    console.log('\n3. Checking old users collection...');
    const usersSnapshot = await db.collection('users').limit(3).get();
    console.log(`   Found ${usersSnapshot.size} users`);

    console.log('\n=== Test Complete ===\n');
    process.exit(0);
}

testCollections().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
