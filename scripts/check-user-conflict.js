const { auth1, auth2, db1, db2 } = require('../lib/firebase-admin');

async function checkUser(identifier) {
    console.log(`Checking for identifier: ${identifier}`);

    // Check Project 1 (GatePass)
    try {
        const user1 = await auth1.getUserByEmail(identifier).catch(() => null);
        if (user1) {
            console.log(`[Project 1 Auth] Found user: ${user1.uid} (${user1.email})`);
        } else {
            // Try with @ctgroup.in
            const email1 = identifier.includes('@') ? identifier : `${identifier}@ctgroup.in`;
            const user1alt = await auth1.getUserByEmail(email1).catch(() => null);
            if (user1alt) console.log(`[Project 1 Auth] Found user with suffix: ${user1alt.uid} (${user1alt.email})`);
        }
    } catch (e) { }

    // Check Project 2 (IoT)
    try {
        const user2 = await auth2.getUserByEmail(identifier).catch(() => null);
        if (user2) {
            console.log(`[Project 2 Auth] Found user: ${user2.uid} (${user2.email})`);
        }
    } catch (e) { }

    // Check Firestore Project 1
    const snap1 = await db1.collection('users').where('email', '==', identifier).get();
    if (!snap1.empty) {
        snap1.forEach(doc => console.log(`[Project 1 Firestore] Found doc: ${doc.id} (Role: ${doc.data().role})`));
    }

    const snap1off = await db1.collection('users').where('official_email', '==', identifier).get();
    if (!snap1off.empty) {
        snap1off.forEach(doc => console.log(`[Project 1 Firestore Official] Found doc: ${doc.id} (Role: ${doc.data().role})`));
    }
}

const identifier = process.argv[2];
if (identifier) {
    checkUser(identifier.toUpperCase());
    checkUser(identifier.toLowerCase());
} else {
    console.log("Please provide an identifier (Registration Number or Email)");
}
