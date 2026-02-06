const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// --- Configuration ---
// List of all department codes manually to avoid import issues
const DEPARTMENTS = {
    CSE: 'Computer Science Engineering',
    ECE: 'Electronics & Communication Engineering',
    ME: 'Mechanical Engineering',
    CE: 'Civil Engineering',
    EE: 'Electrical Engineering',
    AI_ML: 'Artificial Intelligence & Machine Learning Engineering',
    BT: 'Biotechnology',
    APPLIED_SCI: 'Applied Sciences',
    IOT: 'Internet of Things',
    TECH: 'Technology',
    WEB_TECH: 'Web Technology and Multimedia',
    BM: 'Business Management',
    ARCH: 'Architecture',
    INTERIOR: 'Interior Design',
    PHARM: 'Pharmacy',
    PHARMA_SCI: 'Pharmaceutical Sciences',
    MED_LAB: 'Medical Lab Sciences',
    PHYSIOTHERAPY: 'Physiotherapy',
    LAW: 'Law',
    HUMANITIES: 'Humanities',
    HOTEL: 'Hotel Management',
    TOURISM: 'Tourism',
    EDUCATION: 'Education',
    MULTIMEDIA: 'Multimedia',
    CAMPUS: 'Campus Management / Administration'
};

if (!admin.apps.length) {
    try {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey,
            }),
            databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
        });
    } catch (error) {
        console.error('Init Error:', error);
        process.exit(1);
    }
}

const db = admin.firestore();

async function runUniversalPatch() {
    console.log('--- Starting Universal Admin Repair & Sync ---');
    console.log('This will:');
    console.log('1. Populate missing fields (phone, designation) in department collections');
    console.log('2. Sync all admins to the central "users" collection for reliable fetching');

    // 1. Build list of collections to scan
    const deptCodes = Object.keys(DEPARTMENTS);
    const collectionsToScan = ['web_admins'];
    deptCodes.forEach(code => collectionsToScan.push(`web_admins_${code}`));

    let totalProcessed = 0;
    let totalSynced = 0;
    let totalUpdated = 0;

    for (const colName of collectionsToScan) {
        // console.log(`Scanning ${colName}...`);
        const snapshot = await db.collection(colName).get();

        if (snapshot.empty) continue;

        const updates = [];
        const syncs = [];

        for (const doc of snapshot.docs) {
            const data = doc.data();
            const uid = doc.id;
            totalProcessed++;

            // --- A. Prepare Profile Updates ---
            const updateData = {};
            let needsUpdate = false;

            // Defaults
            const defaultDesignation = data.role === 'principal' ? 'Principal' :
                data.role === 'hod' ? 'Head of Department' :
                    'Department Admin';
            const defaultPhone = '+91 98765 00000';

            // Derive department name if missing
            let deptName = data.department_name;
            if (!deptName && data.department && DEPARTMENTS[data.department]) {
                deptName = DEPARTMENTS[data.department];
                updateData.department_name = deptName;
                needsUpdate = true;
            }

            if (!data.designation) {
                updateData.designation = defaultDesignation;
                needsUpdate = true;
            }
            if (!data.phone) {
                updateData.phone = defaultPhone;
                needsUpdate = true;
            }

            // Sync email if missing (crucial)
            if (!data.email && data.id) {
                // heuristic guess
                // updateData.email = ... 
            }

            if (needsUpdate) {
                updates.push(doc.ref.update(updateData));
                totalUpdated++;
            }

            // --- B. Sync to 'users' collection ---
            // We want the 'users' collection to be a reliable lookup directory
            const mergedData = { ...data, ...updateData };

            // Ensure essential fields for 'users' lookup
            const userSyncData = {
                uid: uid,
                email: mergedData.email,
                full_name: mergedData.full_name,
                role: mergedData.role || 'admin',
                department: mergedData.department,
                department_name: mergedData.department_name || deptName,
                designation: mergedData.designation,
                phone: mergedData.phone,
                photoURL: mergedData.photoURL || null,
                status: mergedData.status || 'Active',
                synced_from: colName,
                last_synced: new Date().toISOString()
            };

            // Remove undefined fields
            Object.keys(userSyncData).forEach(key => userSyncData[key] === undefined && delete userSyncData[key]);

            syncs.push(db.collection('users').doc(uid).set(userSyncData, { merge: true }));
            totalSynced++;
        }

        if (updates.length > 0) console.log(`  - ${colName}: Updating ${updates.length} profiles...`);
        if (syncs.length > 0) console.log(`  - ${colName}: Syncing ${syncs.length} users to central repo...`);

        await Promise.all([...updates, ...syncs]);
    }

    console.log(`\n--- Completed ---`);
    console.log(`Processed: ${totalProcessed}`);
    console.log(`Updated Profiles: ${totalUpdated}`);
    console.log(`Synced to 'users': ${totalSynced}`);
}

runUniversalPatch().catch(console.error);
