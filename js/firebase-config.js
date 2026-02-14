// ==========================================
// FIREBASE CONFIGURATION
// Ganti dengan konfigurasi Firebase Anda
// ==========================================

const firebaseConfig = {
   apiKey: "AIzaSyDpiK4F4ilnDDNEwO0djGY-ClwgwBl1eFk",
   authDomain: "asap-1d653.firebaseapp.com",
   projectId: "asap-1d653",
   storageBucket: "asap-1d653.firebasestorage.app",
   messagingSenderId: "143263188364",
   appId: "1:143263188364:web:47b4c003972b3503e882a9",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase Services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Enable offline persistence
db.enablePersistence()
    .catch((err) => {
        if (err.code === 'failed-precondition') {
            console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
            console.log('The current browser does not support persistence.');
        }
    });

// Collection References
const usersRef = db.collection('users');
const schoolsRef = db.collection('schools');
const calendarsRef = db.collection('calendars');
const schedulesRef = db.collection('schedules');
const studentsRef = db.collection('students');
const atpRef = db.collection('atp');
const protaRef = db.collection('prota');
const promesRef = db.collection('promes');
const modulAjarRef = db.collection('modulAjar');
const jurnalRef = db.collection('jurnal');
const nilaiRef = db.collection('nilai');
const bankSoalRef = db.collection('bankSoal');
const subscriptionsRef = db.collection('subscriptions');

console.log('Firebase initialized successfully');