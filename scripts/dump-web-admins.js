const admin = require('firebase-admin');
const fs = require('fs');

const config = {
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID_2,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL_2,
        privateKey: process.env.FIREBASE_PRIVATE_KEY_2?.replace(/\\n/g, '\n'),
    })
};

if (!admin.apps.length) admin.initializeApp(config);
const db = admin.firestore();

const DEPARTMENTS = [
    'CSE', 'ECE', 'ME', 'CE', 'EE', 'AI_ML', 'BT', 'APPLIED_SCI', 'IOT',
    'TECH', 'WEB_TECH', 'BM', 'ARCH', 'INTERIOR', 'PHARM', 'PHARMA_SCI',
    'MED_LAB', 'PHYSIOTHERAPY', 'LAW', 'HUMANITIES', 'HOTEL', 'TOURISM',
    'EDUCATION', 'MULTIMEDIA'
];

async function run() {
    console.log('--- FETCHING WEB ADMIN DATA (ALL DEPARTMENTS) ---');
    const collections = ['web_admins', ...DEPARTMENTS.map(d => `web_admins_${d}`)];
    const promises = collections.map(async col => {
        const snap = await db.collection(col).get();
        return { col, snap };
    });

    const results = await Promise.all(promises);
    let total = 0;
    const finalData = {};

    results.forEach(({ col, snap }) => {
        if (!snap.empty) {
            console.log(`\n=== COLLECTION: ${col} ===`);
            const docs = snap.docs.map(d => {
                const data = d.data();
                console.log(JSON.stringify(data, null, 2));
                return { _id: d.id, ...data };
            });
            finalData[col] = docs;
            total += docs.length;
        }
    });

    console.log(`\nTotal Admin Records Found: ${total}`);
    fs.writeFileSync('scripts/web_admins_full_dump.json', JSON.stringify(finalData, null, 2));
}

run();
