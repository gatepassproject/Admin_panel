import admin from 'firebase-admin';

// Helper to get or initialize a named Firebase app
function getApp(name: string, config: any) {
  const existingApp = admin.apps.find(app => app?.name === name);
  if (existingApp) return existingApp;

  try {
    const app = admin.initializeApp(config, name);
    // Add gRPC keepalive and timeout settings for network resilience
    const db = admin.firestore(app);
    db.settings({
      ignoreUndefinedProperties: true,
      // Increase timeouts for poor network conditions
    });
    console.log(`Firebase Admin: App "${name}" initialized successfully`);
    return app;
  } catch (error) {
    console.error(`Firebase Admin: Critical error initializing app "${name}":`, error);
    return null;
  }
}

const gatepassConfig = {
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID_1,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL_1,
    privateKey: process.env.FIREBASE_PRIVATE_KEY_1?.replace(/\\n/g, '\n'),
  }),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID_1}.firebaseio.com`
};

const iotConfig = {
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID_2,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL_2,
    privateKey: process.env.FIREBASE_PRIVATE_KEY_2?.replace(/\\n/g, '\n'),
  }),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID_2}.firebaseio.com`
};

const gatepassApp = getApp('gatepass', gatepassConfig);
const iotApp = getApp('iot', iotConfig);

export const db1 = gatepassApp ? admin.firestore(gatepassApp) : null;
export const db2 = iotApp ? admin.firestore(iotApp) : null;
export const auth1 = gatepassApp ? admin.auth(gatepassApp) : null;
export const auth2 = iotApp ? admin.auth(iotApp) : null;

export { admin };
