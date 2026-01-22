import admin from 'firebase-admin';

if (!admin.apps.length) {
  // Main gatepass system (Project 1)
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID_1,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL_1,
        privateKey: process.env.FIREBASE_PRIVATE_KEY_1?.replace(/\\n/g, '\n'),
      }),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID_1}.firebaseio.com`
    }, 'gatepass');
    console.log('Firebase Admin: Project 1 (GatePass) initialized');
  } catch (error) {
    console.error('Firebase Admin: Project 1 initialization error', error);
  }

  // IoT system (Project 2)
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID_2,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL_2,
        privateKey: process.env.FIREBASE_PRIVATE_KEY_2?.replace(/\\n/g, '\n'),
      }),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID_2}.firebaseio.com`
    }, 'iot');
    console.log('Firebase Admin: Project 2 (IoT) initialized');
  } catch (error) {
    console.error('Firebase Admin: Project 2 initialization error', error);
  }
}

export const db1 = admin.firestore(admin.app('gatepass'));
export const db2 = admin.firestore(admin.app('iot'));
export const auth1 = admin.auth(admin.app('gatepass'));
export const auth2 = admin.auth(admin.app('iot'));

export { admin };
