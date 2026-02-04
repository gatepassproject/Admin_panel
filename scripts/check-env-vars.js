
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    console.log('No .env.local found');
}

console.log('--- FIREBASE CONFIG CHECK ---');
console.log(`PROJECT_ID_1 (GatePass): ${process.env.FIREBASE_PROJECT_ID_1}`);
console.log(`PROJECT_ID_2 (IoT/Web):  ${process.env.FIREBASE_PROJECT_ID_2}`);
console.log('-----------------------------');

if (process.env.FIREBASE_PROJECT_ID_1 === process.env.FIREBASE_PROJECT_ID_2) {
    console.error('CRITICAL WARNING: Both projects have the SAME Project ID. This explains the data mixing.');
} else {
    console.log('OK: Project IDs are distinct.');
}

console.log('Client Email 1:', process.env.FIREBASE_CLIENT_EMAIL_1 ? 'Set' : 'Missing');
console.log('Client Email 2:', process.env.FIREBASE_CLIENT_EMAIL_2 ? 'Set' : 'Missing');
