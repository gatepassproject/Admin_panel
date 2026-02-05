import { db1, db2 } from '../lib/firebase-admin.js';

async function debugStudents() {
    console.log('--- DB1 (GatePass) app_student ---');
    try {
        const snap1 = await db1.collection('app_student').get();
        console.log(`Total Docs in app_student: ${snap1.size}`);
        snap1.docs.forEach(doc => {
            const data = doc.data();
            console.log(`- [ID: ${doc.id}] Name: ${data.full_name || 'N/A'}, Roll: ${data.roll_no || 'N/A'}, Dept: ${data.department || 'MISSING'}, Role: ${data.role || 'MISSING'}`);
        });
    } catch (e) {
        console.error('Error DB1 (app_student):', e.message);
    }

    console.log('\n--- DB1 (GatePass) users list (role=student) ---');
    try {
        const snapUsers = await db1.collection('users').where('role', '==', 'student').get();
        console.log(`Total Docs in users sharing role=student: ${snapUsers.size}`);
        snapUsers.docs.forEach(doc => {
            const data = doc.data();
            console.log(`- [ID: ${doc.id}] Name: ${data.full_name || 'N/A'}`);
        });
    } catch (e) {
        console.error('Error DB1 (users):', e.message);
    }

    process.exit(0);
}

debugStudents();
