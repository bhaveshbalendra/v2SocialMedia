const apiUrl = import.meta.env.VITE_API_BASE_URL || "";
const isBeta = import.meta.env.VITE_ENABLE_BETA_FEATURE === "true";
const version = import.meta.env.VITE_VITE_APP_VERSION || "";

const firebaseCreds = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export { apiUrl, firebaseCreds, isBeta, version };
