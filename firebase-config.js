// ==========================================
// FIREBASE CONFIGURATION
// Admin PAI Super App
// ==========================================

const firebaseConfig = {
   apiKey: "AIzaSyDpiK4F4ilnDDNEwO0djGY-ClwgwBl1eFk",
  authDomain: "asap-1d653.firebaseapp.com",
  projectId: "asap-1d653",
  storageBucket: "asap-1d653.firebasestorage.app",
  messagingSenderId: "143263188364",
  appId: "1:143263188364:web:47b4c003972b3503e882a9",
};

// ==========================================
// INITIALIZE FIREBASE
// ==========================================

let app;
let auth;
let db;

try {
    // Initialize Firebase App
    app = firebase.initializeApp(firebaseConfig);
    
    // Initialize Auth
    auth = firebase.auth();
    
    // Initialize Firestore with persistence settings
    db = firebase.firestore();
    
    // Enable offline persistence (modern way - no warnings)
    db.enablePersistence()
        .then(() => {
            console.log('✅ Offline persistence enabled');
        })
        .catch((err) => {
            if (err.code === 'failed-precondition') {
                // Multiple tabs open, persistence can only be enabled in one tab at a time
                console.warn('⚠️ Persistence unavailable: Multiple tabs open');
            } else if (err.code === 'unimplemented') {
                // The current browser does not support persistence
                console.warn('⚠️ Persistence not supported by this browser');
            }
        });
    
    console.log('✅ Firebase initialized successfully');
    console.log('📦 Project ID:', firebaseConfig.projectId);
    
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
}
