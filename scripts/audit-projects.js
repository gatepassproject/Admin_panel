
const { db1, db2 } = require('../lib/firebase-admin');

async function audit() {
    console.log('--- AUDITING DATA ISOLATION ---');

    try {
        console.log('\nChecking Project 1 (Mobile App DB) - users collection:');
        const p1Users = await db1.collection('users').get();
        console.log(`Total: ${p1Users.size}`);
        p1Users.docs.forEach(doc => {
            const data = doc.data();
            console.log(`- ${data.full_name} (${data.role}) | ${data.email || 'No email'}`);
        });

        console.log('\nChecking Project 2 (Web Admin DB) - web_admins collection:');
        const p2Admins = await db2.collection('web_admins').get();
        console.log(`Total: ${p2Admins.size}`);
        p2Admins.docs.forEach(doc => {
            const data = doc.data();
            console.log(`- ${data.full_name} (${data.role}) | ${data.email || 'No email'}`);
        });

        console.log('\nChecking Project 2 (Web Admin DB) - users collection (SHOULD BE EMPTY OR LEGACY):');
        const p2Users = await db2.collection('users').get();
        console.log(`Total: ${p2Users.size}`);
        p2Users.docs.forEach(doc => {
            const data = doc.data();
            console.log(`- ${data.full_name} (${data.role}) | ${data.email || 'No email'}`);
        });

    } catch (e) {
        console.error('Error during audit:', e.message);
    }
}

audit();
