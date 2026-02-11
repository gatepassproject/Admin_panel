const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin using service account file directly for reliability
const serviceAccountPath = path.resolve(__dirname, '../../backend/serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function addFacultyData() {
    try {
        // Using employee_id as document ID for easier lookup
        const employeeId = 'FAC001';
        const facultyData = {
            created_at: new Date('2026-02-05T11:04:17Z'),
            department: 'Computer Science',
            designation: 'Assistant Professor',
            email: 'fac001@ctgroup.in',
            employee_id: 'FAC001',
            full_name: 'Dr. Rahul Sharma',
            incharge_of: 'General Faculty',
            is_active: true,
            password: 'password123',
            phone: 'N/A',
            profile_image: 'https://i.pravatar.cc/150',
            role: 'faculty',
            sub_role: 'faculty',
            uid: 'FAC001_Dr._Rahul_Sharma'
        };

        // Add to app_faculty collection using employee_id as document ID
        await db.collection('app_faculty').doc(employeeId).delete();
        await db.collection('app_faculty').doc(employeeId).set(facultyData);

        // Also add to users collection using employee_id as document ID
        await db.collection('users').doc(employeeId).delete();
        await db.collection('users').doc(employeeId).set(facultyData);

        console.log('✅ Faculty data added successfully!');
        console.log('Document ID: FAC001');
        console.log('Collections: app_faculty, users');
        console.log('Data:', JSON.stringify(facultyData, null, 2));
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding faculty data:', error);
        process.exit(1);
    }
}

addFacultyData();
