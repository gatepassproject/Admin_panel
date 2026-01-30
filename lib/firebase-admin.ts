import admin from 'firebase-admin';

if (!admin.apps.length) {
  // Main gatepass system (Project 1)
  const projectId1 = process.env.FIREBASE_PROJECT_ID_1;
  const clientEmail1 = process.env.FIREBASE_CLIENT_EMAIL_1;
  const privateKey1 = process.env.FIREBASE_PRIVATE_KEY_1;

  if (projectId1 && clientEmail1 && privateKey1) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectId1,
          clientEmail: clientEmail1,
          privateKey: privateKey1.replace(/\\n/g, '\n'),
        }),
        databaseURL: `https://${projectId1}.firebaseio.com`
      }, 'gatepass');
      console.log('Firebase Admin: Project 1 (GatePass) initialized');
    } catch (error) {
      console.error('Firebase Admin: Project 1 initialization error', error);
    }
  } else {
    console.warn('Firebase Admin: Project 1 credentials missing. Skipping initialization.');
  }

  // IoT system (Project 2)
  const projectId2 = process.env.FIREBASE_PROJECT_ID_2;
  const clientEmail2 = process.env.FIREBASE_CLIENT_EMAIL_2;
  const privateKey2 = process.env.FIREBASE_PRIVATE_KEY_2;

  if (projectId2 && clientEmail2 && privateKey2) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectId2,
          clientEmail: clientEmail2,
          privateKey: privateKey2.replace(/\\n/g, '\n'),
        }),
        databaseURL: `https://${projectId2}.firebaseio.com`
      }, 'iot');
      console.log('Firebase Admin: Project 2 (IoT) initialized');
    } catch (error) {
      console.error('Firebase Admin: Project 2 initialization error', error);
    }
  } else {
    console.warn('Firebase Admin: Project 2 credentials missing. Skipping initialization.');
  }
}

// Function to get DB or return null if not initialized
const getDb = (name: string) => {
  try {
    return admin.firestore(admin.app(name));
  } catch {
    return null;
  }
};

const getAuth = (name: string) => {
  try {
    return admin.auth(admin.app(name));
  } catch {
    return null;
  }
};

// We use type casting here to satisfy TypeScript. 
// If these are null at runtime, they will throw an error when used, 
// which is typically caught in the API route try-catch blocks.
export const db1 = getDb('gatepass') as admin.firestore.Firestore;
export const db2 = getDb('iot') as admin.firestore.Firestore;
export const auth1 = getAuth('gatepass') as admin.auth.Auth;
export const auth2 = getAuth('iot') as admin.auth.Auth;

export { admin };
