import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBhABm6H15CioadCebAoS3N6QN_a4mysSY",
  authDomain: "sgo-sdk.firebaseapp.com",
  databaseURL: "https://sgo-sdk-default-rtdb.firebaseio.com",
  projectId: "sgo-sdk",
  storageBucket: "sgo-sdk.firebasestorage.app",
  messagingSenderId: "20143007303",
  appId: "1:20143007303:web:d9c8374478dba21f86f362"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);