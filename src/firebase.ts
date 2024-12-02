import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAVsSPDydUDRE5t6gZ22ag4UQWpJ2y51bo",
  authDomain: "registros-190.firebaseapp.com",
  projectId: "registros-190",
  storageBucket: "registros-190.firebasestorage.app",
  messagingSenderId: "491013522434",
  appId: "1:491013522434:web:266d9a927cb948eb42531b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);