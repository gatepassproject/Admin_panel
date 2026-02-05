import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCbYQax8yLoy4xc_UdBmnK2Fbimw3KCffY",
    authDomain: "gatepass-49d43.firebaseapp.com",
    projectId: "gatepass-49d43",
    storageBucket: "gatepass-49d43.appspot.com",
    messagingSenderId: "239850557624",
    appId: "1:239850557624:web:e7e9416f2dc4cc4644424d",
    measurementId: "G-KQ7M7F5K8K"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

// Enable analytics only if browser supports it
export let analytics = null;

isSupported().then((yes) => {
    if (yes) analytics = getAnalytics(app);
});
