const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined;

if (!projectId) {
    console.error('Missing credentials');
    process.exit(1);
}

admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
});

const db = admin.firestore();

async function debugFetch() {
    // Simulate "Master Admin CSE"
    const userRole = 'master_admin';
    const userDept = 'CSE';

    console.log(`Debugging fetch for: Role=${userRole}, Dept=${userDept}`);

    // Mimic applyDepartmentFilter
    const possibleValues = ['CSE', 'Computer Science Engineering', 'Computer Science'];
    console.log('Possible department values:', possibleValues);

    try {
        const query = db.collection('gate_passes');

        // Test 1: Query with department filter
        const snapshot1 = await query.where('department', 'in', possibleValues).limit(5).get();
        console.log(`\nTest 1 (search by 'department'): Found ${snapshot1.size} docs`);
        snapshot1.forEach(doc => console.log(` - ID: ${doc.id}, Dept: ${doc.data().department}, Name: ${doc.data().full_name || doc.data().student_name}`));

        // Test 2: Query with destination filter
        const snapshot2 = await query.where('destination', 'in', possibleValues).limit(5).get();
        console.log(`\nTest 2 (search by 'destination'): Found ${snapshot2.size} docs`);
        snapshot2.forEach(doc => console.log(` - ID: ${doc.id}, Dest: ${doc.data().destination}, Name: ${doc.data().visitor_name}`));

        // Test 3: Status variations
        const snapshot3 = await query.where('status', '==', 'pending').limit(2).get();
        console.log(`\nTest 3 (search status='pending' lowercase): Found ${snapshot3.size} docs`);

        const snapshot4 = await query.where('status', '==', 'Pending').limit(2).get();
        console.log(`\nTest 4 (search status='Pending' capitalized): Found ${snapshot4.size} docs`);

    } catch (error) {
        console.error('Debug Error:', error);
    }
    process.exit(0);
}

debugFetch();
