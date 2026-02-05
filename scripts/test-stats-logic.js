const admin = require('firebase-admin');
const serviceAccount = require('../../backend/serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db1 = admin.firestore();

async function testStats() {
    console.log('--- Testing Stats Logic for Principal (IOT) ---');

    const department = 'IOT';
    const userRole = 'principal';

    const isManagement = userRole === 'admin' || userRole === 'principal' || userRole === 'higher_authority';
    const shouldFilter = department && department !== 'CAMPUS' && !isManagement;

    console.log('Context - Dept:', department, 'Role:', userRole);
    console.log('Should Filter Area-Specific Data:', shouldFilter);

    // 1. Students
    let studentsCount = 0;
    const studentCollections = ['app_student', 'add_student'];
    for (const col of studentCollections) {
        let q = db1.collection(col);
        if (shouldFilter) {
            // Simplified for test
            q = q.where('department', '==', department);
        }
        const snap = await q.get();
        studentsCount += snap.docs.filter(d => d.id !== 'README').length;
    }

    // 2. Faculty
    let facultyCount = 0;
    const facultyCollections = ['app_faculty', 'add_faculty', 'add_facutly'];
    for (const col of facultyCollections) {
        let q = db1.collection(col);
        if (shouldFilter) {
            q = q.where('department', '==', department);
        }
        const snap = await q.get();
        facultyCount += snap.docs.filter(d => d.id !== 'README').length;
    }

    console.log('Final Counts - Students:', studentsCount, 'Faculty:', facultyCount);

    if (studentsCount > 0 && facultyCount > 0) {
        console.log('✅ SUCCESS: Principal can see global data!');
    } else {
        console.log('❌ FAILURE: Principal is still restricted or data is missing.');
    }

    process.exit(0);
}

testStats().catch(e => {
    console.error(e);
    process.exit(1);
});
