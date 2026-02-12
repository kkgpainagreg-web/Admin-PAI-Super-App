// ==========================================
// FIREBASE CONFIGURATION
// Admin PAI Super App
// ==========================================

// PENTING: Ganti dengan konfigurasi Firebase Anda!
// Cara mendapatkan konfigurasi:
// 1. Buka https://console.firebase.google.com
// 2. Pilih project Anda
// 3. Klik ikon gear (Settings) di sidebar → Project settings
// 4. Scroll ke bawah ke "Your apps"
// 5. Jika belum ada web app, klik icon </> untuk menambahkan
// 6. Copy konfigurasi di bawah ini

const firebaseConfig = {
  apiKey: "AIzaSyDpiK4F4ilnDDNEwO0djGY-ClwgwBl1eFk",
  authDomain: "asap-1d653.firebaseapp.com",
  projectId: "asap-1d653",
  storageBucket: "asap-1d653.firebasestorage.app",
  messagingSenderId: "143263188364",
  appId: "1:143263188364:web:47b4c003972b3503e882a9",
  measurementId: "G-3VRD49K5PE"
};

// ==========================================
// JANGAN EDIT KODE DI BAWAH INI
// ==========================================

// Initialize Firebase
let app;
let auth;
let db;

try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    
    // Firestore settings (updated method - no more deprecated warning)
    db.settings({
        cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
    });
    
    // Enable offline persistence (updated method)
    db.enablePersistence({ synchronizeTabs: true })
        .then(() => {
            console.log('✅ Offline persistence enabled');
        })
        .catch((err) => {
            if (err.code === 'failed-precondition') {
                console.warn('⚠️ Persistence failed: Multiple tabs open');
            } else if (err.code === 'unimplemented') {
                console.warn('⚠️ Persistence not supported by browser');
            }
        });
    
    console.log('✅ Firebase initialized successfully');
    console.log('📦 Project ID:', firebaseConfig.projectId);
    
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
    alert('Gagal menghubungkan ke Firebase. Periksa konfigurasi Anda.');
}

// ==========================================
// PANDUAN SETUP FIREBASE
// ==========================================
/*
LANGKAH-LANGKAH SETUP:

1. BUAT PROJECT FIREBASE
   - Buka https://console.firebase.google.com
   - Klik "Add project" atau "Create a project"
   - Beri nama project (contoh: admin-pai-app)
   - Ikuti wizard hingga selesai

2. TAMBAHKAN WEB APP
   - Di dashboard project, klik icon </> (Web)
   - Beri nama app (contoh: Admin PAI Web)
   - JANGAN centang "Firebase Hosting" dulu
   - Klik "Register app"
   - COPY konfigurasi yang muncul ke variabel firebaseConfig di atas

3. AKTIFKAN AUTHENTICATION
   - Di sidebar, klik Build → Authentication
   - Klik "Get started"
   - Di tab "Sign-in method", klik "Email/Password"
   - Enable toggle pertama
   - Klik "Save"

4. AKTIFKAN FIRESTORE
   - Di sidebar, klik Build → Firestore Database
   - Klik "Create database"
   - Pilih "Start in test mode" (untuk development)
   - Pilih lokasi asia-southeast2
   - Klik "Enable"

5. TEST APLIKASI
   - Refresh halaman aplikasi Anda
   - Coba daftar dengan email dan password
   - Jika berhasil, Anda akan masuk ke dashboard

TROUBLESHOOTING:
- Error "auth/configuration-not-found": Authentication belum diaktifkan
- Error "permission-denied": Firestore rules belum diset
- Error "invalid-api-key": API key salah, copy ulang dari Firebase Console
*/
