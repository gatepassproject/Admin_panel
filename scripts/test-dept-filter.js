const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = path.resolve(__dirname, '../../backend/serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}
const db = admin.firestore();

async function testFilters() {
    console.log('--- Testing Department Filters ---');

    // Query 1: Code 'CSE'
    const snap1 = await db.collection('app_student').where('department', '==', 'CSE').get();
    console.log(`Query "department == CSE": ${snap1.size} documents.`);

    // Query 2: Name 'Computer Science'
    const snap2 = await db.collection('app_student').where('department', '==', 'Computer Science').get();
    console.log(`Query "department == Computer Science": ${snap2.size} documents.`);

    // Query 3: Name 'Computer Science Engineering' (defined in constants)
    const snap3 = await db.collection('app_student').where('department', '==', 'Computer Science Engineering').get();
    console.log(`Query "department == Computer Science Engineering": ${snap3.size} documents.`);
}

testFilters().then(() => process.exit());
