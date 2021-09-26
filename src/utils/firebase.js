import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCst1iAbgfxznI4z98CiNUj2mzBR8EbiEk",
    authDomain: "live-demo-b3724.firebaseapp.com",
    projectId: "live-demo-b3724",
    storageBucket: "live-demo-b3724.appspot.com",
    messagingSenderId: "269118493133",
    appId: "1:269118493133:web:20aeb425c3004b9766b484"
};

let db = null;

export const initilizeFirebase = () => {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
}

export const getDB = () => {
    return db;
}
