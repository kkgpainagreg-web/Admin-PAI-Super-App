// Firebase Configuration
// PENTING: Ganti dengan konfigurasi Firebase Anda sendiri

const firebaseConfig = {
        apiKey: "AIzaSyDpiK4F4ilnDDNEwO0djGY-ClwgwBl1eFk",
  	authDomain: "asap-1d653.firebaseapp.com",
  	projectId: "asap-1d653",
  	storageBucket: "asap-1d653.firebasestorage.app",
  	messagingSenderId: "143263188364",
  	appId: "1:143263188364:web:47b4c003972b3503e882a9",
      };

// Cara mendapatkan konfigurasi Firebase:
// 1. Buka https://console.firebase.google.com
// 2. Buat project baru atau pilih project yang ada
// 3. Klik ikon gear (Settings) > Project settings
// 4. Scroll ke bawah, klik "Add app" pilih Web (</>)
// 5. Daftarkan app, copy konfigurasi ke atas
// 6. Di sidebar, aktifkan:
//    - Authentication > Sign-in method > Email/Password
//    - Firestore Database > Create database > Start in test mode

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence
db.enablePersistence().catch((err) => {
    if (err.code === 'failed-precondition') {
        console.log('Persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
        console.log('Persistence not supported');
    }
});

console.log('Firebase initialized successfully');