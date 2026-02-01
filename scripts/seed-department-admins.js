/**
 * Script to seed department-specific master admins in Firebase Project 2
 * 
 * This script creates a master admin account for each CT Group department.
 * Each master admin can independently manage their department's users.
 * 
 * Usage: node scripts/seed-department-admins.js
 */

const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Department configuration
const DEPARTMENTS = {
    CSE: { code: 'CSE', name: 'Computer Science Engineering' },
    ECE: { code: 'ECE', name: 'Electronics & Communication Engineering' },
    ME: { code: 'ME', name: 'Mechanical Engineering' },
    CE: { code: 'CE', name: 'Civil Engineering' },
    EE: { code: 'EE', name: 'Electrical Engineering' },
    AI_ML: { code: 'AI_ML', name: 'Artificial Intelligence & Machine Learning Engineering' },
    BT: { code: 'BT', name: 'Biotechnology' },
    BM: { code: 'BM', name: 'Business Management' },
    ARCH: { code: 'ARCH', name: 'Architecture' },
    PHARM: { code: 'PHARM', name: 'Pharmacy' },
    LAW: { code: 'LAW', name: 'Law' },
    HOTEL: { code: 'HOTEL', name: 'Hotel Management' },
    EDUCATION: { code: 'EDUCATION', name: 'Education' },
    TECH: { code: 'TECH', name: 'Technology' },
    APPLIED_SCI: { code: 'APPLIED_SCI', name: 'Applied Sciences' },
    HUMANITIES: { code: 'HUMANITIES', name: 'Humanities' },
    INTERIOR: { code: 'INTERIOR', name: 'Interior Design' },
    IOT: { code: 'IOT', name: 'Internet of Things' },
    MED_LAB: { code: 'MED_LAB', name: 'Medical Lab Sciences' },
    MULTIMEDIA: { code: 'MULTIMEDIA', name: 'Multimedia' },
    PHARMA_SCI: { code: 'PHARMA_SCI', name: 'Pharmaceutical Sciences' },
    PHYSIOTHERAPY: { code: 'PHYSIOTHERAPY', name: 'Physiotherapy' },
    TOURISM: { code: 'TOURISM', name: 'Tourism' },
    WEB_TECH: { code: 'WEB_TECH', name: 'Web Technology and Multimedia' },
};

// Initialize Firebase Admin for Project 2 (IoT System - where web data is stored)
function initializeFirebase() {
    if (admin.apps.length > 0) {
        return admin.app('iot');
    }

    const iotConfig = {
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID_2,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL_2,
            privateKey: process.env.FIREBASE_PRIVATE_KEY_2?.replace(/\\n/g, '\n'),
        }),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID_2}.firebaseio.com`
    };

    return admin.initializeApp(iotConfig, 'iot');
}

async function createMasterAdmin(app, deptCode, deptName) {
    const auth = admin.auth(app);
    const db = admin.firestore(app);

    // Generate credentials
    const email = `masteradmin.${deptCode.toLowerCase()}@ctgroup.in`;
    const password = `MasterAdmin@${deptCode}123`;
    const fullName = `Master Admin - ${deptName}`;

    try {
        console.log(`\n🔄 Creating master admin for ${deptCode}...`);

        // 1. Create user in Firebase Auth
        let userRecord;
        try {
            userRecord = await auth.createUser({
                email,
                password,
                displayName: fullName,
            });
            console.log(`✅ Created auth user: ${email}`);
        } catch (error) {
            if (error.code === 'auth/email-already-exists') {
                console.log(`⚠️  User already exists in auth, fetching...`);
                userRecord = await auth.getUserByEmail(email);
                // Update password
                await auth.updateUser(userRecord.uid, { password });
                console.log(`✅ Updated password for existing user`);
            } else {
                throw error;
            }
        }

        // 2. Create user document in department-scoped collection
        const collectionName = `web_admins_${deptCode}`;
        const userData = {
            uid: userRecord.uid,
            email,
            full_name: fullName,
            role: 'master_admin',
            department: deptCode,
            department_name: deptName,
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            phone: '',
            designation: 'Master Administrator',
        };

        await db.collection(collectionName).doc(userRecord.uid).set(userData);
        console.log(`✅ Created Firestore document in ${collectionName}`);

        // 3. Also create a metadata document in departments collection
        await db.collection('departments').doc(deptCode).set({
            code: deptCode,
            name: deptName,
            master_admin_uid: userRecord.uid,
            master_admin_email: email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });
        console.log(`✅ Created department metadata`);

        return {
            success: true,
            deptCode,
            email,
            password,
            uid: userRecord.uid,
        };
    } catch (error) {
        console.error(`❌ Error creating master admin for ${deptCode}:`, error.message);
        return {
            success: false,
            deptCode,
            error: error.message,
        };
    }
}

async function seedAllDepartmentAdmins() {
    console.log('🚀 Starting Department Master Admin Seeding...\n');
    console.log('📍 Target: Firebase Project 2 (IoT System - Web Data Storage)\n');

    const app = initializeFirebase();
    const results = [];

    for (const [code, dept] of Object.entries(DEPARTMENTS)) {
        const result = await createMasterAdmin(app, code, dept.name);
        results.push(result);

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Print summary
    console.log('\n\n' + '='.repeat(80));
    console.log('📊 SEEDING SUMMARY');
    console.log('='.repeat(80) + '\n');

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`✅ Successfully created: ${successful.length}/${results.length} master admins\n`);

    if (successful.length > 0) {
        console.log('📝 LOGIN CREDENTIALS:\n');
        console.log('Department | Email | Password');
        console.log('-'.repeat(80));
        successful.forEach(r => {
            console.log(`${r.deptCode.padEnd(12)} | ${r.email.padEnd(40)} | ${r.password}`);
        });
    }

    if (failed.length > 0) {
        console.log('\n\n❌ FAILED:\n');
        failed.forEach(r => {
            console.log(`${r.deptCode}: ${r.error}`);
        });
    }

    console.log('\n' + '='.repeat(80));
    console.log('✨ Seeding complete!');
    console.log('='.repeat(80) + '\n');

    process.exit(0);
}

// Run the seeding
seedAllDepartmentAdmins().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
});
