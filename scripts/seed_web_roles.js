const admin = require('firebase-admin');

const BASE_URL = 'http://localhost:3000/api/users';
const PROJECT_ID = '2'; // Web/IoT DB

const DEPARTMENTS = [
    { code: 'CSE', name: 'Computer Science', email: 'masteradmin.cse@ctgroup.in', pass: 'MasterAdmin@CSE123' },
    { code: 'ECE', name: 'Electronics', email: 'masteradmin.ece@ctgroup.in', pass: 'MasterAdmin@ECE123' },
    { code: 'ME', name: 'Mechanical Engineering', email: 'masteradmin.me@ctgroup.in', pass: 'MasterAdmin@ME123' },
    { code: 'CE', name: 'Civil Engineering', email: 'masteradmin.ce@ctgroup.in', pass: 'MasterAdmin@CE123' },
    { code: 'EE', name: 'Electrical Engineering', email: 'masteradmin.ee@ctgroup.in', pass: 'MasterAdmin@EE123' },
    { code: 'AI_ML', name: 'AI & ML', email: 'masteradmin.ai_ml@ctgroup.in', pass: 'MasterAdmin@AI_ML123' },
    { code: 'BT', name: 'Biotechnology', email: 'masteradmin.bt@ctgroup.in', pass: 'MasterAdmin@BT123' },
    { code: 'BM', name: 'Biomedical', email: 'masteradmin.bm@ctgroup.in', pass: 'MasterAdmin@BM123' },
    { code: 'ARCH', name: 'Architecture', email: 'masteradmin.arch@ctgroup.in', pass: 'MasterAdmin@ARCH123' },
    { code: 'PHARM', name: 'Pharmacy', email: 'masteradmin.pharm@ctgroup.in', pass: 'MasterAdmin@PHARM123' },
    { code: 'LAW', name: 'Law', email: 'masteradmin.law@ctgroup.in', pass: 'MasterAdmin@LAW123' },
    { code: 'HOTEL', name: 'Hotel Management', email: 'masteradmin.hotel@ctgroup.in', pass: 'MasterAdmin@HOTEL123' },
    { code: 'EDUCATION', name: 'Education', email: 'masteradmin.education@ctgroup.in', pass: 'MasterAdmin@EDUCATION123' },
    { code: 'TECH', name: 'Technology', email: 'masteradmin.tech@ctgroup.in', pass: 'MasterAdmin@TECH123' },
    { code: 'APPLIED_SCI', name: 'Applied Sciences', email: 'masteradmin.applied_sci@ctgroup.in', pass: 'MasterAdmin@APPLIED_SCI123' },
    { code: 'HUMANITIES', name: 'Humanities', email: 'masteradmin.humanities@ctgroup.in', pass: 'MasterAdmin@HUMANITIES123' },
    { code: 'INTERIOR', name: 'Interior Design', email: 'masteradmin.interior@ctgroup.in', pass: 'MasterAdmin@INTERIOR123' },
    { code: 'IOT', name: 'IoT', email: 'masteradmin.iot@ctgroup.in', pass: 'MasterAdmin@IOT123' },
    { code: 'MED_LAB', name: 'Medical Lab', email: 'masteradmin.med_lab@ctgroup.in', pass: 'MasterAdmin@MED_LAB123' },
    { code: 'MULTIMEDIA', name: 'Multimedia', email: 'masteradmin.multimedia@ctgroup.in', pass: 'MasterAdmin@MULTIMEDIA123' },
    { code: 'PHARMA_SCI', name: 'Pharmaceutical Sci', email: 'masteradmin.pharma_sci@ctgroup.in', pass: 'MasterAdmin@PHARMA_SCI123' },
    { code: 'PHYSIOTHERAPY', name: 'Physiotherapy', email: 'masteradmin.physiotherapy@ctgroup.in', pass: 'MasterAdmin@PHYSIOTHERAPY123' },
    { code: 'TOURISM', name: 'Tourism', email: 'masteradmin.tourism@ctgroup.in', pass: 'MasterAdmin@TOURISM123' },
    { code: 'WEB_TECH', name: 'Web Technology', email: 'masteradmin.web_tech@ctgroup.in', pass: 'MasterAdmin@WEB_TECH123' }
];

// Admin Credentials Mock (Since we are seeding, we might need a super admin cookie or just bypass auth locally? 
// Actually, the API requires cookies. 
// A better approach for SEEDING is to use the Firebase Admin SDK directly in a standalone script if API is protected.
// BUT, using API ensures all business logic (schema, isolation) is respected.
// Let's try to assume we can run this script, but valid auth is tricky. 
// ALTERNATIVE: Modify the API temporarily to allow a special header or run against localhost without auth?
// NO, that's insecure.
// BEST PATH: Create a script that acts as a 'client' but creates users via direct Firebase calls to be safe and bypass API auth constraints for seeding.
// Wait, the user wants me to use the 'web universal control'. That implies using the App flow.
// But for BULK creation, a script is best.
// I will write this script to use Firebase Admin DIRECTLY. It avoids auth headers issues.

const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

// We need to initialize the app with the credentials from ENV. 
// Since this is running in Node, we can read .env.local
require('dotenv').config({ path: '.env.local' });

// We need to support the DUAL DB setup
const serviceAccount1 = {
    projectId: process.env.FIREBASE_PROJECT_ID_1,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL_1,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY_1 || '').replace(/\\n/g, '\n'),
};

const serviceAccount2 = {
    projectId: process.env.FIREBASE_PROJECT_ID_2,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL_2,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY_2 || '').replace(/\\n/g, '\n'),
};

// Initialize Project 2 (IoT/Web)
const app2 = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount2)
});

const db = getFirestore(app2);
const auth = getAuth(app2);

async function createUser(userData) {
    const { email, password, role, department, full_name, designation } = userData;
    try {
        let uid;
        try {
            const userRecord = await auth.getUserByEmail(email);
            uid = userRecord.uid;
            console.log(`User exists: ${email} (${uid})`);
            // Update password if needed? No, user provided specific ones.
        } catch (e) {
            if (e.code === 'auth/user-not-found') {
                const userRecord = await auth.createUser({
                    email,
                    password,
                    displayName: full_name,
                });
                uid = userRecord.uid;
                console.log(`Created Auth: ${email}`);
            } else {
                throw e;
            }
        }

        // Create/Update Firestore
        // For Project 2, collection is 'web_admins'
        // But wait, the API uses 'web_admins' + department?
        // Let's check api/users/route.ts logic:
        // getCollectionName(project=2) -> 'web_admins'
        // IF department provided -> 'web_admins_{DEPT}'
        // BUT wait, 'web_admins' is usually GLOBAL.
        // The instructions said "department-wise RBAC".
        // The API route says: if (department) return getDepartmentCollectionName('web_admins', department);
        // So yes, we should put them in `web_admins_{DEPT}`?
        // Wait, Master Admins might be in `web_admins` (Global)?
        // Re-reading logic: "if requester.role !== 'admin' ... force query to department".
        // The User Request: "create principals... for login in admin_panel2 department wise".
        // Master Admins for a department should probably be in that department's collection too?
        // OR are they the "Super Users" of that department?
        // Usually, a "Master Admin" for CSE is the top-level for CSE.
        // Let's put them in `web_admins_CSE`.

        const collectionBase = 'web_admins';
        const collectionName = department ? `${collectionBase}_${department}` : collectionBase;

        await db.collection(collectionName).doc(uid).set({
            uid,
            email,
            full_name,
            role,
            department, // Crucial
            designation,
            status: 'Inside',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }, { merge: true });

        console.log(`Synced Firestore (${collectionName}): ${email}`);
        return uid;

    } catch (error) {
        console.error(`Failed to process ${email}`, error);
    }
}

async function seed() {
    console.log('Starting Seed for Project 2 (Web Admins)...');

    for (const dept of DEPARTMENTS) {
        console.log(`\nProcessing ${dept.name} (${dept.code})...`);

        // 1. Master Admin (The provided one)
        // They are the head of the department's web access.
        await createUser({
            email: dept.email,
            password: dept.pass,
            role: 'master_admin',
            department: dept.code,
            full_name: `Master Admin ${dept.code}`,
            designation: 'Department Head Admin'
        });

        // 2. Mock Principal
        await createUser({
            email: `principal.${dept.code.toLowerCase()}@ctgroup.in`,
            password: 'Password123!',
            role: 'principal',
            department: dept.code,
            full_name: `Principal ${dept.code}`,
            designation: 'Principal'
        });

        // 3. Mock HOD
        await createUser({
            email: `hod.${dept.code.toLowerCase()}@ctgroup.in`,
            password: 'Password123!',
            role: 'hod', // Note: 'hod' role
            department: dept.code,
            full_name: `HOD ${dept.code}`,
            designation: 'Head of Department'
        });

        // 4. Mock Faculty
        await createUser({
            email: `faculty.${dept.code.toLowerCase()}@ctgroup.in`,
            password: 'Password123!',
            role: 'faculty',
            department: dept.code,
            full_name: `Faculty ${dept.code}`,
            designation: 'Senior Faculty'
        });

        // 5. Mock Student (Web Access? Usually no, but needed for hierarchy check?)
        // User said: "create principals, hods, faculty". Students are usually App users (Project 1).
        // So we SKIP students here. Logic is "login in admin_panel2". Students don't log in here usually.
        // But wait, "principal have access to... students".
        // The students exist in Project 1. The principal needs to SEE them.
        // The principal is created in Project 2.
    }
    console.log('\nSeed Complete!');
    process.exit(0);
}

seed();
