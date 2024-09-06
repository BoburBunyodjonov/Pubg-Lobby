import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyCEjS_xdPiJCZW-NXNoSTZutobeekfArNU",
    authDomain: "pubg-2024.firebaseapp.com",
    databaseURL: "https://pubg-2024-default-rtdb.firebaseio.com",
    projectId: "pubg-2024",
    storageBucket: "pubg-2024.appspot.com",
    messagingSenderId: "926486156805",
    appId: "1:926486156805:web:85bb0e62c089be57432e6c",
    measurementId: "G-90HNSGGS6M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export initialized instances for use in your app
export const realTimeDB = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const firestore = getFirestore(app);

export default app;
