// Import the functions you need from the SDKs you need
import { firebaseCreds } from "@/config/configs";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: firebaseCreds.apiKey,
  authDomain: firebaseCreds.authDomain,
  projectId: firebaseCreds.projectId,
  storageBucket: firebaseCreds.storageBucket,
  messagingSenderId: firebaseCreds.messagingSenderId,
  appId: firebaseCreds.appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
