import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBt2s4Tsrt5OOrjcXTaC9b5fmhG0TsEVEw",
    authDomain: "pollpal-07-07-05.firebaseapp.com",
    projectId: "pollpal-07-07-05",
    storageBucket: "pollpal-07-07-05.firebasestorage.app",
    messagingSenderId: "365096140216",
    appId: "1:365096140216:web:49b058c975e58bd9c5234d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
