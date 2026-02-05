const admin = require('firebase-admin');
const path = require('path');

const saPath = path.resolve(__dirname, '../backend/serviceAccountKey.json');
const serviceAccount = require(saPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

async function checkStudent() {
    try {
        // Check Firestore app_student collection
        console.log('\n=== Checking app_student collection ===');
        const studentsSnapshot = await db.collection('app_student').get();
        console.log(`Total students: ${studentsSnapshot.size}`);

        studentsSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.roll_no === '2201619' || data.roll_no === 2201619) {
                console.log('\nFound student 2201619:');
                console.log('UID:', doc.id);
                console.log('Email:', data.email);
                console.log('Roll No:', data.roll_no);
                console.log('Full Name:', data.full_name);
            }
        });

        // Check users collection
        console.log('\n=== Checking users collection ===');
        const usersSnapshot = await db.collection('users').get();
        console.log(`Total users: ${usersSnapshot.size}`);

        usersSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.roll_no === '2201619' || data.roll_no === 2201619) {
                console.log('\nFound in users collection:');
                console.log('UID:', doc.id);
                console.log('Email:', data.email);
                console.log('Role:', data.role);
            }
        });

        // Check Firebase Auth
        console.log('\n=== Checking Firebase Auth ===');
        const listUsersResult = await auth.listUsers(1000);
        const student2201619 = listUsersResult.users.find(u =>
            u.email && (u.email.startsWith('2201619@') || u.email.includes('2201619'))
        );

        if (student2201619) {
            console.log('\nFound in Auth:');
            console.log('UID:', student2201619.uid);
            console.log('Email:', student2201619.email);
            console.log('Display Name:', student2201619.displayName);
        } else {
            console.log('\nNOT FOUND in Firebase Auth');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkStudent();
