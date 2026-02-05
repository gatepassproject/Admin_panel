const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Config for Project 2 (Web Admin Panel / IoT)
const config = {
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID_2,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL_2,
        privateKey: process.env.FIREBASE_PRIVATE_KEY_2?.replace(/\\n/g, '\n'),
    })
};

if (!admin.apps.length) {
    admin.initializeApp(config);
}

const db = admin.firestore();

async function exportData() {
    console.log('--- EXPORTING DATA FROM PROJECT 2 (WEB/IoT DB) ---');

    const collections = [
        'web_admins',
        'gate_status',
        'broadcasts',
        'system_settings',
        'admin_logs'
    ];

    const allData = {};

    try {
        for (const colName of collections) {
            console.log(`Fetching ${colName}...`);
            const snapshot = await db.collection(colName).get();

            allData[colName] = snapshot.docs.map(doc => {
                // Convert timestamps to strings for JSON
                const data = doc.data();
                const formatted = { _id: doc.id };

                for (const [key, value] of Object.entries(data)) {
                    if (value && typeof value === 'object' && typeof value.toDate === 'function') {
                        formatted[key] = value.toDate().toISOString();
                    } else {
                        formatted[key] = value;
                    }
                }
                return formatted;
            });
        }

        const outputPath = path.join(__dirname, 'project2_dump.json');
        fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));
        console.log(`Success! Data written to ${outputPath}`);

    } catch (error) {
        console.error('Error fetching data:', error);
        process.exit(1);
    }
}

exportData();
