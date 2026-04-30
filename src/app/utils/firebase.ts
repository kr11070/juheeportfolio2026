import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFa74wwvXeCOvGeZ92mOBmw3chHk4EwgY",
  authDomain: "krport-61aa5.firebaseapp.com",
  databaseURL: "https://krport-61aa5-default-rtdb.firebaseio.com",
  projectId: "krport-61aa5",
  storageBucket: "krport-61aa5.firebasestorage.app",
  messagingSenderId: "533629897468",
  appId: "1:533629897468:web:741cb783fcfc6cfb04e579",
  measurementId: "G-7FWZ4RWLEK"
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const DATABASE_URL = "https://krport-61aa5-default-rtdb.firebaseio.com";

