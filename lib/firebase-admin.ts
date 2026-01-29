import admin from 'firebase-admin';

const formatKey = (key: string | undefined) => {
  if (!key) return undefined;
  let k = key.trim();
  // Remove potential wrapping quotes
  if (k.startsWith('"') && k.endsWith('"')) {
    k = k.substring(1, k.length - 1);
  }
  // Handle literal newlines or escaped newlines (both \n and \\n)
  return k.replace(/\\n/g, '\n');
};

function getOrCreateApp(name: string, config: any) {
  const existingApp = admin.apps.find(app => app?.name === name);
  if (existingApp) return existingApp;

  try {
    const app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.projectId,
        clientEmail: config.clientEmail,
        privateKey: formatKey(config.privateKey),
      }),
      databaseURL: `https://${config.projectId}.firebaseio.com`
    }, name);
    console.log(`Firebase Admin: App "${name}" initialized`);
    return app;
  } catch (error) {
    console.error(`Firebase Admin: Initialization error for "${name}"`, error);
    throw error;
  }
}

// Main gatepass system (Project 1)
const app1 = getOrCreateApp('gatepass', {
  projectId: process.env.FIREBASE_PROJECT_ID_1,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL_1,
  privateKey: process.env.FIREBASE_PRIVATE_KEY_1,
});

// IoT system (Project 2)
const app2 = getOrCreateApp('iot', {
  projectId: process.env.FIREBASE_PROJECT_ID_2,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL_2,
  privateKey: process.env.FIREBASE_PRIVATE_KEY_2,
});

export const db1 = admin.firestore(app1);
export const db2 = admin.firestore(app2);
export const auth1 = admin.auth(app1);
export const auth2 = admin.auth(app2);

export { admin };
