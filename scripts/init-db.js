const admin = require('firebase-admin');
const path = require('path');

// 1. Initialize with Service Account
// Path is relative to where we run this script from, assuming running from admin_panel2 folder
const serviceAccountPath = path.resolve(__dirname, '../../backend/serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 2. Define Data
const COLLECTIONS = [
    'roles',
    'web_admins',
    'mobile_users',
    'student_pass_requests',
    'faculty_approvals',
    'hod_approvals',
    'principal_approvals',
    'security_gate_logs',
    'visitor_registrations',
    'admission_appointments',
    'admission_visitors',
    'admission_activity_logs',
    'settings',
    'notifications',
    'audit_logs'
];

const ROLES = [
    // Web
    { id: 'master_admin', name: 'Master Admin', platform: 'web' },

    // Shared / Mobile & Web hierarchies usually overlap, simplified here
    { id: 'principal', name: 'Principal', platform: 'both' },
    { id: 'hod', name: 'HOD', platform: 'both' },
    { id: 'faculty', name: 'Faculty', platform: 'both' },

    // Mobile Specific
    { id: 'higher_authority', name: 'Higher Authority', platform: 'mobile' },
    { id: 'student', name: 'Student', platform: 'mobile' },
    { id: 'parent', name: 'Parent', platform: 'mobile' },
    { id: 'security_guard', name: 'Security Guard', platform: 'mobile' },
    { id: 'admission_staff', name: 'Admission Cell Staff', platform: 'mobile' }
];

async function initDB() {
    console.log('🚀 Starting Database Initialization...');
    console.log(`Target Project: ${serviceAccount.project_id}`);

    try {
        // A. Create Roles
        console.log('\n👤 Seeding Roles...');
        const batch = db.batch();
        for (const role of ROLES) {
            const ref = db.collection('roles').doc(role.id);
            batch.set(ref, {
                name: role.name,
                platform: role.platform,
                created_at: new Date().toISOString()
            }, { merge: true });
        }
        await batch.commit();
        console.log(`✅ Default roles created/updated.`);

        // B. Initialize Collections (Create Metadata Doc)
        console.log('\nkB📁 Initializing Collections...');
        for (const colName of COLLECTIONS) {
            // Check if exists (optional, but good for logs)
            // Just write a _metadata doc to ensure it shows up in Console
            await db.collection(colName).doc('_metadata').set({
                initialized: true,
                description: `Collection for ${colName}`,
                updated_at: new Date().toISOString()
            }, { merge: true });
            console.log(`   - ${colName} [OK]`);
        }

        console.log('\n✨ Database Initialized Successfully!');

    } catch (error) {
        console.error('❌ Error initializing database:', error);
    }
}

initDB();
