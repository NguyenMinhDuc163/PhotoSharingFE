// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBu11UPrRSftBMf1K86wN6o93G36vWG_04",

    authDomain: "photosharing-58237.firebaseapp.com",

    projectId: "photosharing-58237",

    storageBucket: "photosharing-58237.appspot.com",

    messagingSenderId: "677702837428",

    appId: "1:677702837428:web:6576fe506c11ccba2a23e1"

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
