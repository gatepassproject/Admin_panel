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

async function inspectTimes() {
    try {
        console.log('Fetching recent gate passes to inspect time fields...');
        const snapshot = await db.collection('gate_passes')
            .orderBy('created_at', 'desc')
            .limit(5)
            .get();

        if (snapshot.empty) {
            console.log('No passes found.');
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            console.log(`\nID: ${doc.id}`);
            console.log('Status:', data.status);
            console.log('Time Fields:');

            // Log all likely time fields
            const timeFields = [
                'created_at', 'timestamp', 'date',
                'approved_at', 'approval_time', 'approved_timestamp',
                'exit_time', 'out_time', 'actual_exit_time',
                'entry_time', 'in_time', 'actual_return_time', 'return_time',
                'expected_return_time', 'valid_until'
            ];

            timeFields.forEach(field => {
                if (data[field]) {
                    console.log(` - ${field}:`, data[field]);
                }
            });

            // Log all fields to catch any missed ones
            // console.log('All Keys:', Object.keys(data));
        });

    } catch (error) {
        console.error('Error:', error);
    }
    process.exit(0);
}

inspectTimes();
