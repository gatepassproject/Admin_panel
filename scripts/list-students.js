const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = path.resolve(__dirname, '../../backend/serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();
console.log('Connected to Project ID:', admin.app().options.credential.projectId);


async function listStudents() {
    console.log('--- Listing ALL app_student documents (limit 50) ---');
    try {
        const snapshot = await db.collection('app_student').limit(50).get();
        if (snapshot.empty) {
            console.log('No documents found in app_student.');
            return;
        }

        console.log(`Total documents found: ${snapshot.size}`);

        const departments = new Set();
        const users = [];

        snapshot.forEach(doc => {
            const data = doc.data();
            departments.add(data.department);
            users.push({
                uid: doc.id,
                name: data.full_name,
                department: data.department,
                role: data.role
            });
        });

        console.log('--- Distinct Departments Found ---');
        console.log(Array.from(departments));

        console.log('--- Student List ---');
        console.table(users);

    } catch (error) {
        console.error('Error fetching students:', error);
    }
}

listStudents().then(() => process.exit());
