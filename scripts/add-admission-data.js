const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin using service account file directly for reliability
const serviceAccountPath = path.resolve(__dirname, '../../backend/serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function addAdmissionData() {
    try {
        // First, delete any existing document with id ADM002
        await db.collection('app_admission').doc('ADM002').delete();

        // Add ADM002 with the correct structure (similar to ADM001)
        await db.collection('app_admission').doc('ADM002').set({
            created_at: new Date('2026-02-05T11:04:28Z'),
            department: 'Admission Cell',
            email: 'adm002@ctgroup.in',
            employee_id: 'ADM002',
            full_name: 'Admission Staff',
            is_active: true,
            password: 'password123',
            role: 'admission',
            uid: 'ADM002_Admission_Staff'
        });

        console.log('✅ Admission data added successfully!');
        console.log('Document ID: ADM002');
        console.log('Collection: app_admission');
        console.log('Data:', JSON.stringify({
            created_at: '2026-02-05T11:04:28Z',
            department: 'Admission Cell',
            email: 'adm002@ctgroup.in',
            employee_id: 'ADM002',
            full_name: 'Admission Staff',
            is_active: true,
            password: 'password123',
            role: 'admission',
            uid: 'ADM002_Admission_Staff'
        }, null, 2));
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding admission data:', error);
        process.exit(1);
    }
}

addAdmissionData();
