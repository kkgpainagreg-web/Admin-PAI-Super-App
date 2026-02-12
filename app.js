// ==========================================
// ADMIN PAI SUPER APP - Main Application
// Version: 1.0.0
// ==========================================

// ===== GLOBAL VARIABLES =====
let currentUser = null;
let currentUserData = null;
let siswaData = [];
let generatedDocs = {};
let tpCount = 1;
let langkahCount = 1;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    console.log('🚀 Initializing Admin PAI Super App...');
    
    // Set default dates
    setDefaultDates();
    
    // Auth state observer
    auth.onAuthStateChanged(user => {
        setTimeout(() => {
            hideLoading();
            if (user) {
                currentUser = user;
                loadUserData();
                showMainApp();
                console.log('✅ User logged in:', user.email);
            } else {
                currentUser = null;
                currentUserData = null;
                showLogin();
                console.log('ℹ️ No user logged in');
            }
        }, 1000);
    });

    // Setup all form listeners
    setupFormListeners();
    
    // Setup other event listeners
    setupEventListeners();
}

function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) input.value = today;
    });
}

function setupFormListeners() {
    // Auth Forms
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('registerForm')?.addEventListener('submit', handleRegister);
    
    // Profile Forms
    document.getElementById('formProfilUser')?.addEventListener('submit', saveProfilUser);
    document.getElementById('formSatdik')?.addEventListener('submit', saveSatdik);
    document.getElementById('formKepsek')?.addEventListener('submit', saveKepsek);
    
    // Data Forms
    document.getElementById('formTambahSiswa')?.addEventListener('submit', saveSiswa);
    document.getElementById('formAgenda')?.addEventListener('submit', saveAgenda);
    document.getElementById('formJadwal')?.addEventListener('submit', saveJadwal);
    document.getElementById('formJurnal')?.addEventListener('submit', saveJurnal);
    document.getElementById('formSoal')?.addEventListener('submit', saveSoal);
    document.getElementById('formLKPD')?.addEventListener('submit', saveLKPD);
    document.getElementById('formGenerator')?.addEventListener('submit', generateDocuments);
}

function setupEventListeners() {
    // Soal jenis change - show/hide PG options
    document.getElementById('soalJenis')?.addEventListener('change', function() {
        const opsiPG = document.getElementById('opsiPG');
        opsiPG.style.display = this.value === 'pg' ? 'block' : 'none';
    });
    
    // Jurnal - update absensi info
    document.getElementById('jurnalTanggal')?.addEventListener('change', updateJurnalAbsenInfo);
    document.getElementById('jurnalKelas')?.addEventListener('change', updateJurnalAbsenInfo);
    
    // Absen kelas change - update rombel options
    document.getElementById('absenKelas')?.addEventListener('change', updateAbsenRombelOptions);
    document.getElementById('nilaiKelas')?.addEventListener('change', updateNilaiRombelOptions);
}

// ===== AUTHENTICATION =====
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const btn = document.getElementById('btnLogin');
    
    if (!email || !password) {
        showToast('Lengkapi email dan password', 'warning');
        return;
    }
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Memproses...';
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        showToast('Berhasil masuk!', 'success');
    } catch (error) {
        console.error('Login error:', error);
        let message = 'Gagal masuk. ';
        switch (error.code) {
            case 'auth/user-not-found':
                message += 'Email tidak terdaftar.';
                break;
            case 'auth/wrong-password':
                message += 'Password salah.';
                break;
            case 'auth/invalid-email':
                message += 'Format email tidak valid.';
                break;
            case 'auth/too-many-requests':
                message += 'Terlalu banyak percobaan. Coba lagi nanti.';
                break;
            default:
                message += error.message;
        }
        showToast(message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i>Masuk';
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const btn = document.getElementById('btnRegister');
    
    if (!name || !email || !password) {
        showToast('Lengkapi semua data', 'warning');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password minimal 6 karakter', 'warning');
        return;
    }
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Memproses...';
    
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Save user data to Firestore
        await db.collection('users').doc(userCredential.user.uid).set({
            nama: name,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showToast('Pendaftaran berhasil! Selamat datang.', 'success');
    } catch (error) {
        console.error('Register error:', error);
        let message = 'Gagal mendaftar. ';
        switch (error.code) {
            case 'auth/email-already-in-use':
                message += 'Email sudah terdaftar.';
                break;
            case 'auth/weak-password':
                message += 'Password terlalu lemah.';
                break;
            case 'auth/invalid-email':
                message += 'Format email tidak valid.';
                break;
            default:
                message += error.message;
        }
        showToast(message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-user-plus mr-2"></i>Daftar';
    }
}

async function logout() {
    if (!confirm('Yakin ingin keluar dari aplikasi?')) return;
    
    try {
        await auth.signOut();
        showToast('Berhasil keluar', 'success');
    } catch (error) {
        showToast('Gagal keluar: ' + error.message, 'error');
    }
}

async function loadUserData() {
    try {
        const doc = await db.collection('users').doc(currentUser.uid).get();
        if (doc.exists) {
            currentUserData = doc.data();
            updateUserDisplay();
        }
        
        // Load all data
        await Promise.all([
            loadSiswa(),
            loadAgenda(),
            loadJadwal(),
            loadJurnal(),
            loadBankSoal(),
            loadLKPD(),
            loadProfil()
        ]);
        
        updateStats();
        loadDashboardWidgets();
        
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

function updateUserDisplay() {
    const nama = currentUserData?.nama || currentUser.email.split('@')[0];
    document.getElementById('sidebarUserName').textContent = nama;
    document.getElementById('sidebarUserEmail').textContent = currentUser.email;
    
    // Update welcome text
    const welcomeText = document.getElementById('welcomeText');
    if (welcomeText) {
        const hour = new Date().getHours();
        let greeting = 'Selamat pagi';
        if (hour >= 11 && hour < 15) greeting = 'Selamat siang';
        else if (hour >= 15 && hour < 18) greeting = 'Selamat sore';
        else if (hour >= 18) greeting = 'Selamat malam';
        welcomeText.textContent = `${greeting}, ${nama}!`;
    }
}

// ===== UI FUNCTIONS =====
function hideLoading() {
    const loading = document.getElementById('loadingScreen');
    loading.style.opacity = '0';
    setTimeout(() => {
        loading.classList.add('hidden');
    }, 300);
}

function showLogin() {
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('registerPage').classList.add('hidden');
    document.getElementById('mainApp').classList.add('hidden');
}

function showRegister() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('registerPage').classList.remove('hidden');
}

function showMainApp() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('registerPage').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    showPage('dashboard');
}

function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });
    
    // Show selected page
    const selectedPage = document.getElementById(`page-${pageName}`);
    if (selectedPage) {
        selectedPage.classList.remove('hidden');
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === pageName) {
            btn.classList.add('active');
        }
    });
    
    // Close sidebar on mobile
    if (window.innerWidth < 1024) {
        closeSidebar();
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');
    
    // Reset classes
    toast.className = 'fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 z-50 flex items-center gap-3';
    
    // Set type-specific styles
    const types = {
        success: { bg: 'toast-success', icon: 'fa-check-circle' },
        error: { bg: 'toast-error', icon: 'fa-times-circle' },
        warning: { bg: 'toast-warning', icon: 'fa-exclamation-triangle' },
        info: { bg: 'toast-info', icon: 'fa-info-circle' }
    };
    
    const config = types[type] || types.info;
    toast.classList.add(config.bg);
    toastIcon.className = `fas ${config.icon}`;
    toastMessage.textContent = message;
    
    // Show toast
    toast.classList.add('show');
    toast.classList.remove('translate-y-full', 'opacity-0');
    
    // Auto hide
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('translate-y-full', 'opacity-0');
    }, 3500);
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function showAddSiswaModal() {
    document.getElementById('formTambahSiswa').reset();
    openModal('modalSiswa');
}

// ===== DASHBOARD WIDGETS =====
async function loadDashboardWidgets() {
    // Load recent jurnal
    loadRecentJurnal();
    // Load upcoming agenda
    loadUpcomingAgenda();
}

async function loadRecentJurnal() {
    const container = document.getElementById('recentJurnal');
    if (!container) return;
    
    try {
        const snapshot = await db.collection('users').doc(currentUser.uid)
            .collection('jurnal')
            .orderBy('tanggal', 'desc')
            .limit(5)
            .get();
        
        if (snapshot.empty) {
            container.innerHTML = '<p class="text-center text-gray-500 py-4">Belum ada jurnal</p>';
            return;
        }
        
        let html = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            html += `
                <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-book text-blue-600"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="font-medium text-gray-800 truncate">${data.materi}</p>
                        <p class="text-sm text-gray-500">Kelas ${data.kelas}${data.rombel ? '-' + data.rombel : ''} • ${formatDate(data.tanggal)}</p>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading recent jurnal:', error);
        container.innerHTML = '<p class="text-center text-gray-500 py-4">Gagal memuat data</p>';
    }
}

async function loadUpcomingAgenda() {
    const container = document.getElementById('upcomingAgenda');
    if (!container) return;
    
    try {
        const today = new Date().toISOString().split('T')[0];
        const snapshot = await db.collection('users').doc(currentUser.uid)
            .collection('agenda')
            .where('tglMulai', '>=', today)
            .orderBy('tglMulai')
            .limit(5)
            .get();
        
        if (snapshot.empty) {
            container.innerHTML = '<p class="text-center text-gray-500 py-4">Tidak ada agenda mendatang</p>';
            return;
        }
        
        const jenisConfig = {
            kegiatan: { bg: 'bg-blue-100', text: 'text-blue-600', icon: 'fa-calendar-check' },
            libur: { bg: 'bg-red-100', text: 'text-red-600', icon: 'fa-umbrella-beach' },
            ujian: { bg: 'bg-yellow-100', text: 'text-yellow-600', icon: 'fa-file-alt' },
            rapat: { bg: 'bg-purple-100', text: 'text-purple-600', icon: 'fa-users' }
        };
        
        let html = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const config = jenisConfig[data.jenis] || jenisConfig.kegiatan;
            
            html += `
                <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div class="w-10 h-10 ${config.bg} rounded-full flex items-center justify-center flex-shrink-0">
                        <i class="fas ${config.icon} ${config.text}"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="font-medium text-gray-800 truncate">${data.judul}</p>
                        <p class="text-sm text-gray-500">${formatDate(data.tglMulai)}</p>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading upcoming agenda:', error);
        container.innerHTML = '<p class="text-center text-gray-500 py-4">Gagal memuat data</p>';
    }
}
// ===== PROFIL FUNCTIONS =====
async function loadProfil() {
    try {
        // Load user profile
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
            const data = userDoc.data();
            document.getElementById('profilNama').value = data.nama || '';
            document.getElementById('profilNIP').value = data.nip || '';
            document.getElementById('profilEmail').value = currentUser.email;
            document.getElementById('profilHP').value = data.hp || '';
        }
        
        // Load satuan pendidikan
        const satdikDoc = await db.collection('users').doc(currentUser.uid)
            .collection('settings').doc('satdik').get();
        if (satdikDoc.exists) {
            const data = satdikDoc.data();
            document.getElementById('satdikNama').value = data.nama || '';
            document.getElementById('satdikNPSN').value = data.npsn || '';
            document.getElementById('satdikAlamat').value = data.alamat || '';
            document.getElementById('satdikKec').value = data.kecamatan || '';
            document.getElementById('satdikKab').value = data.kabupaten || '';
            document.getElementById('satdikProv').value = data.provinsi || '';
        }
        
        // Load kepala sekolah
        const kepsekDoc = await db.collection('users').doc(currentUser.uid)
            .collection('settings').doc('kepsek').get();
        if (kepsekDoc.exists) {
            const data = kepsekDoc.data();
            document.getElementById('kepsekNama').value = data.nama || '';
            document.getElementById('kepsekNIP').value = data.nip || '';
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function saveProfilUser(e) {
    e.preventDefault();
    
    try {
        await db.collection('users').doc(currentUser.uid).update({
            nama: document.getElementById('profilNama').value,
            nip: document.getElementById('profilNIP').value,
            hp: document.getElementById('profilHP').value,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        currentUserData.nama = document.getElementById('profilNama').value;
        updateUserDisplay();
        showToast('Profil berhasil disimpan!', 'success');
    } catch (error) {
        showToast('Gagal menyimpan: ' + error.message, 'error');
    }
}

async function saveSatdik(e) {
    e.preventDefault();
    
    try {
        await db.collection('users').doc(currentUser.uid)
            .collection('settings').doc('satdik').set({
                nama: document.getElementById('satdikNama').value,
                npsn: document.getElementById('satdikNPSN').value,
                alamat: document.getElementById('satdikAlamat').value,
                kecamatan: document.getElementById('satdikKec').value,
                kabupaten: document.getElementById('satdikKab').value,
                provinsi: document.getElementById('satdikProv').value,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        showToast('Data sekolah berhasil disimpan!', 'success');
    } catch (error) {
        showToast('Gagal menyimpan: ' + error.message, 'error');
    }
}

async function saveKepsek(e) {
    e.preventDefault();
    
    try {
        await db.collection('users').doc(currentUser.uid)
            .collection('settings').doc('kepsek').set({
                nama: document.getElementById('kepsekNama').value,
                nip: document.getElementById('kepsekNIP').value,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        showToast('Data kepala sekolah berhasil disimpan!', 'success');
    } catch (error) {
        showToast('Gagal menyimpan: ' + error.message, 'error');
    }
}

// ===== SISWA FUNCTIONS =====
async function loadSiswa() {
    try {
        const snapshot = await db.collection('users').doc(currentUser.uid)
            .collection('siswa').orderBy('kelas').orderBy('nama').get();
        
        siswaData = [];
        snapshot.forEach(doc => {
            siswaData.push({ id: doc.id, ...doc.data() });
        });
        
        renderSiswaTable();
        updateRombelOptions();
    } catch (error) {
        console.error('Error loading siswa:', error);
    }
}

function renderSiswaTable(filteredData = null) {
    const data = filteredData || siswaData;
    const tbody = document.getElementById('tabelSiswa');
    
    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-4 py-12 text-center text-gray-500">
                    <i class="fas fa-users text-4xl mb-3 text-gray-300"></i>
                    <p>Belum ada data siswa</p>
                    <p class="text-sm">Import dari Google Spreadsheet atau tambah manual</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = data.map((siswa, index) => `
        <tr class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm text-gray-600">${index + 1}</td>
            <td class="px-4 py-3 text-sm font-medium text-gray-800">${siswa.nis}</td>
            <td class="px-4 py-3 text-sm text-gray-800">${siswa.nama}</td>
            <td class="px-4 py-3 text-sm">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${siswa.jk === 'L' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}">
                    ${siswa.jk === 'L' ? 'L' : 'P'}
                </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">${siswa.kelas}</td>
            <td class="px-4 py-3 text-sm text-gray-600">${siswa.rombel || '-'}</td>
            <td class="px-4 py-3 text-sm">
                <button onclick="deleteSiswa('${siswa.id}')" class="text-red-500 hover:text-red-700 p-1" title="Hapus">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function filterSiswa() {
    const search = document.getElementById('searchSiswa').value.toLowerCase();
    const kelas = document.getElementById('filterKelas').value;
    
    const filtered = siswaData.filter(siswa => {
        const matchSearch = siswa.nama.toLowerCase().includes(search) || 
                           siswa.nis.toLowerCase().includes(search);
        const matchKelas = !kelas || siswa.kelas === kelas;
        return matchSearch && matchKelas;
    });
    
    renderSiswaTable(filtered);
}

async function saveSiswa(e) {
    e.preventDefault();
    
    try {
        await db.collection('users').doc(currentUser.uid).collection('siswa').add({
            nis: document.getElementById('siswanis').value,
            nama: document.getElementById('siswaNama').value,
            jk: document.getElementById('siswaJK').value,
            kelas: document.getElementById('siswaKelas').value,
            rombel: document.getElementById('siswaRombel').value.toUpperCase(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        closeModal('modalSiswa');
        loadSiswa();
        updateStats();
        showToast('Siswa berhasil ditambahkan!', 'success');
    } catch (error) {
        showToast('Gagal menyimpan: ' + error.message, 'error');
    }
}

async function deleteSiswa(id) {
    if (!confirm('Yakin ingin menghapus data siswa ini?')) return;
    
    try {
        await db.collection('users').doc(currentUser.uid)
            .collection('siswa').doc(id).delete();
        loadSiswa();
        updateStats();
        showToast('Data siswa berhasil dihapus', 'success');
    } catch (error) {
        showToast('Gagal menghapus: ' + error.message, 'error');
    }
}

async function importCSV() {
    const url = document.getElementById('csvUrl').value.trim();
    
    if (!url) {
        showToast('Masukkan URL Google Spreadsheet', 'warning');
        return;
    }
    
    try {
        showToast('Mengambil data dari Google Spreadsheet...', 'info');
        
        // Convert Google Sheets URL to CSV export URL
        let csvUrl = url;
        if (url.includes('docs.google.com/spreadsheets')) {
            const matches = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
            if (matches) {
                csvUrl = `https://docs.google.com/spreadsheets/d/${matches[1]}/export?format=csv`;
            }
        }
        
        const response = await fetch(csvUrl);
        if (!response.ok) throw new Error('Gagal mengambil data. Pastikan spreadsheet sudah dipublish.');
        
        const text = await response.text();
        const rows = text.split('\n').filter(row => row.trim());
        
        // Skip header row
        const dataRows = rows.slice(1);
        
        if (dataRows.length === 0) {
            showToast('Tidak ada data untuk diimport', 'warning');
            return;
        }
        
        const batch = db.batch();
        const siswaRef = db.collection('users').doc(currentUser.uid).collection('siswa');
        
        let count = 0;
        let errors = 0;
        
        for (const row of dataRows) {
            // Parse CSV with support for quoted fields
            const cols = parseCSVRow(row);
            
            if (cols.length >= 5 && cols[0] && cols[1]) {
                const docRef = siswaRef.doc();
                batch.set(docRef, {
                    nis: cols[0].trim(),
                    nama: cols[1].trim(),
                    jk: cols[2].trim().toUpperCase() === 'L' ? 'L' : 'P',
                    kelas: cols[3].trim(),
                    rombel: (cols[4] || '').trim().toUpperCase(),
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                count++;
            } else {
                errors++;
            }
        }
        
        if (count === 0) {
            showToast('Tidak ada data valid untuk diimport. Periksa format kolom.', 'warning');
            return;
        }
        
        await batch.commit();
        loadSiswa();
        updateStats();
        
        let message = `Berhasil import ${count} data siswa!`;
        if (errors > 0) {
            message += ` (${errors} baris dilewati karena format tidak sesuai)`;
        }
        showToast(message, 'success');
        document.getElementById('csvUrl').value = '';
        
    } catch (error) {
        console.error('Import error:', error);
        showToast('Gagal import: ' + error.message, 'error');
    }
}

function parseCSVRow(row) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    
    return result;
}

function updateRombelOptions() {
    const rombels = [...new Set(siswaData.map(s => s.rombel).filter(r => r))].sort();
    
    ['absenRombel', 'nilaiRombel'].forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Semua Rombel</option>' +
                rombels.map(r => `<option value="${r}">${r}</option>`).join('');
            select.value = currentValue;
        }
    });
}

function updateAbsenRombelOptions() {
    const kelas = document.getElementById('absenKelas').value;
    const rombels = [...new Set(siswaData.filter(s => s.kelas === kelas).map(s => s.rombel).filter(r => r))].sort();
    
    const select = document.getElementById('absenRombel');
    select.innerHTML = '<option value="">Semua Rombel</option>' +
        rombels.map(r => `<option value="${r}">${r}</option>`).join('');
}

function updateNilaiRombelOptions() {
    const kelas = document.getElementById('nilaiKelas').value;
    const rombels = [...new Set(siswaData.filter(s => s.kelas === kelas).map(s => s.rombel).filter(r => r))].sort();
    
    const select = document.getElementById('nilaiRombel');
    select.innerHTML = '<option value="">Semua Rombel</option>' +
        rombels.map(r => `<option value="${r}">${r}</option>`).join('');
}

// ===== AGENDA FUNCTIONS =====
async function loadAgenda() {
    try {
        const filterBulan = document.getElementById('filterAgendaBulan')?.value || '';
        const snapshot = await db.collection('users').doc(currentUser.uid)
            .collection('agenda').orderBy('tglMulai', 'desc').get();
        
        const container = document.getElementById('listAgenda');
        
        if (snapshot.empty) {
            container.innerHTML = '<p class="text-center text-gray-500 py-8">Belum ada agenda</p>';
            return;
        }
        
        const jenisConfig = {
            kegiatan: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800', icon: '📚' },
            libur: { bg: 'bg-red-50 border-red-200', text: 'text-red-800', icon: '🏖️' },
            ujian: { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-800', icon: '📝' },
            rapat: { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-800', icon: '👥' }
        };
        
        let html = '';
        let count = 0;
        
        snapshot.forEach(doc => {
            const data = doc.data();
            
            // Filter by month
            if (filterBulan && !data.tglMulai.substring(5, 7).includes(filterBulan)) {
                return;
            }
            
            count++;
            const config = jenisConfig[data.jenis] || jenisConfig.kegiatan;
            
            html += `
                <div class="border rounded-lg p-4 ${config.bg}">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                                <span class="text-lg">${config.icon}</span>
                                <h4 class="font-semibold ${config.text}">${data.judul}</h4>
                            </div>
                            <p class="text-sm text-gray-600">
                                <i class="fas fa-calendar mr-1"></i>
                                ${formatDate(data.tglMulai)}
                                ${data.tglSelesai && data.tglSelesai !== data.tglMulai ? ' - ' + formatDate(data.tglSelesai) : ''}
                            </p>
                            ${data.keterangan ? `<p class="text-sm text-gray-500 mt-1">${data.keterangan}</p>` : ''}
                        </div>
                        <button onclick="deleteAgenda('${doc.id}')" class="text-red-500 hover:text-red-700 p-1">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html || '<p class="text-center text-gray-500 py-8">Tidak ada agenda untuk bulan ini</p>';
    } catch (error) {
        console.error('Error loading agenda:', error);
    }
}

async function saveAgenda(e) {
    e.preventDefault();
    
    try {
        const tglMulai = document.getElementById('agendaTglMulai').value;
        const tglSelesai = document.getElementById('agendaTglSelesai').value || tglMulai;
        
        await db.collection('users').doc(currentUser.uid).collection('agenda').add({
            judul: document.getElementById('agendaJudul').value,
            tglMulai: tglMulai,
            tglSelesai: tglSelesai,
            jenis: document.getElementById('agendaJenis').value,
            keterangan: document.getElementById('agendaKeterangan').value,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        document.getElementById('formAgenda').reset();
        setDefaultDates();
        loadAgenda();
        loadDashboardWidgets();
        showToast('Agenda berhasil ditambahkan!', 'success');
    } catch (error) {
        showToast('Gagal menyimpan: ' + error.message, 'error');
    }
}

async function deleteAgenda(id) {
    if (!confirm('Yakin ingin menghapus agenda ini?')) return;
    
    try {
        await db.collection('users').doc(currentUser.uid).collection('agenda').doc(id).delete();
        loadAgenda();
        loadDashboardWidgets();
        showToast('Agenda berhasil dihapus', 'success');
    } catch (error) {
        showToast('Gagal menghapus: ' + error.message, 'error');
    }
}

// ===== JADWAL FUNCTIONS =====
async function loadJadwal() {
    try {
        const snapshot = await db.collection('users').doc(currentUser.uid)
            .collection('jadwal').get();
        
        const tbody = document.getElementById('tabelJadwal');
        
        if (snapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-gray-500">Belum ada jadwal</td></tr>';
            return;
        }
        
        const hariOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        let jadwalData = [];
        snapshot.forEach(doc => {
            jadwalData.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort by day and time
        jadwalData.sort((a, b) => {
            const dayDiff = hariOrder.indexOf(a.hari) - hariOrder.indexOf(b.hari);
            if (dayDiff !== 0) return dayDiff;
            return a.mulai.localeCompare(b.mulai);
        });
        
        const hariColors = {
            'Senin': 'bg-blue-100 text-blue-800',
            'Selasa': 'bg-green-100 text-green-800',
            'Rabu': 'bg-yellow-100 text-yellow-800',
            'Kamis': 'bg-purple-100 text-purple-800',
            'Jumat': 'bg-pink-100 text-pink-800',
            'Sabtu': 'bg-orange-100 text-orange-800'
        };
        
        tbody.innerHTML = jadwalData.map(jadwal => `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3">
                    <span class="px-2 py-1 rounded-full text-xs font-medium ${hariColors[jadwal.hari]}">${jadwal.hari}</span>
                </td>
                <td class="px-4 py-3 font-medium">Kelas ${jadwal.kelas}</td>
                <td class="px-4 py-3">${jadwal.rombel || '-'}</td>
                <td class="px-4 py-3">${jadwal.mulai} - ${jadwal.selesai}</td>
                <td class="px-4 py-3">
                    <button onclick="deleteJadwal('${jadwal.id}')" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading jadwal:', error);
    }
}

async function saveJadwal(e) {
    e.preventDefault();
    
    try {
        await db.collection('users').doc(currentUser.uid).collection('jadwal').add({
            hari: document.getElementById('jadwalHari').value,
            kelas: document.getElementById('jadwalKelas').value,
            rombel: document.getElementById('jadwalRombel').value.toUpperCase(),
            mulai: document.getElementById('jadwalMulai').value,
            selesai: document.getElementById('jadwalSelesai').value,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        document.getElementById('formJadwal').reset();
        loadJadwal();
        showToast('Jadwal berhasil ditambahkan!', 'success');
    } catch (error) {
        showToast('Gagal menyimpan: ' + error.message, 'error');
    }
}

async function deleteJadwal(id) {
    if (!confirm('Yakin ingin menghapus jadwal ini?')) return;
    
    try {
        await db.collection('users').doc(currentUser.uid).collection('jadwal').doc(id).delete();
        loadJadwal();
        showToast('Jadwal berhasil dihapus', 'success');
    } catch (error) {
        showToast('Gagal menghapus: ' + error.message, 'error');
    }
}
// ===== ABSENSI FUNCTIONS =====
function loadAbsensi() {
    const tanggal = document.getElementById('absenTanggal').value;
    const kelas = document.getElementById('absenKelas').value;
    const rombel = document.getElementById('absenRombel').value;
    
    if (!tanggal || !kelas) {
        showToast('Pilih tanggal dan kelas', 'warning');
        return;
    }
    
    let filtered = siswaData.filter(s => s.kelas === kelas);
    if (rombel) {
        filtered = filtered.filter(s => s.rombel === rombel);
    }
    
    // Sort by name
    filtered.sort((a, b) => a.nama.localeCompare(b.nama));
    
    const tbody = document.getElementById('tabelAbsensi');
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="px-3 py-8 text-center text-gray-500">Tidak ada siswa di kelas ini</td></tr>';
        return;
    }
    
    // Load existing absensi
    db.collection('users').doc(currentUser.uid)
        .collection('absensi')
        .where('tanggal', '==', tanggal)
        .where('kelas', '==', kelas)
        .get()
        .then(snapshot => {
            const absensiData = {};
            snapshot.forEach(doc => {
                const data = doc.data();
                absensiData[data.siswaId] = data.status;
            });
            
            tbody.innerHTML = filtered.map((siswa, index) => {
                const status = absensiData[siswa.id] || 'H';
                return `
                    <tr class="hover:bg-gray-50">
                        <td class="px-3 py-2 text-sm text-center">${index + 1}</td>
                        <td class="px-3 py-2 text-sm font-medium">${siswa.nis}</td>
                        <td class="px-3 py-2 text-sm">${siswa.nama}</td>
                        <td class="px-3 py-2 text-center">
                            <input type="radio" name="absen_${siswa.id}" value="H" ${status === 'H' ? 'checked' : ''} class="absen-radio w-5 h-5 text-green-600">
                        </td>
                        <td class="px-3 py-2 text-center">
                            <input type="radio" name="absen_${siswa.id}" value="I" ${status === 'I' ? 'checked' : ''} class="absen-radio w-5 h-5 text-yellow-600">
                        </td>
                        <td class="px-3 py-2 text-center">
                            <input type="radio" name="absen_${siswa.id}" value="S" ${status === 'S' ? 'checked' : ''} class="absen-radio w-5 h-5 text-blue-600">
                        </td>
                        <td class="px-3 py-2 text-center">
                            <input type="radio" name="absen_${siswa.id}" value="A" ${status === 'A' ? 'checked' : ''} class="absen-radio w-5 h-5 text-red-600">
                        </td>
                    </tr>
                `;
            }).join('');
        });
}

function setAllHadir() {
    document.querySelectorAll('.absen-radio[value="H"]').forEach(radio => {
        radio.checked = true;
    });
    showToast('Semua siswa ditandai hadir', 'info');
}

async function simpanAbsensi() {
    const tanggal = document.getElementById('absenTanggal').value;
    const kelas = document.getElementById('absenKelas').value;
    const rombel = document.getElementById('absenRombel').value;
    
    if (!tanggal || !kelas) {
        showToast('Pilih tanggal dan kelas terlebih dahulu', 'warning');
        return;
    }
    
    try {
        showToast('Menyimpan absensi...', 'info');
        
        const batch = db.batch();
        const absensiRef = db.collection('users').doc(currentUser.uid).collection('absensi');
        
        // Delete existing
        const existingSnapshot = await absensiRef
            .where('tanggal', '==', tanggal)
            .where('kelas', '==', kelas)
            .get();
        
        existingSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        
        // Get filtered siswa
        let filtered = siswaData.filter(s => s.kelas === kelas);
        if (rombel) {
            filtered = filtered.filter(s => s.rombel === rombel);
        }
        
        // Save new absensi
        filtered.forEach(siswa => {
            const radioName = `absen_${siswa.id}`;
            const selectedRadio = document.querySelector(`input[name="${radioName}"]:checked`);
            
            if (selectedRadio) {
                const newDocRef = absensiRef.doc();
                batch.set(newDocRef, {
                    siswaId: siswa.id,
                    siswaNama: siswa.nama,
                    siswaNis: siswa.nis,
                    tanggal: tanggal,
                    kelas: kelas,
                    rombel: rombel || '',
                    status: selectedRadio.value,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        });
        
        await batch.commit();
        showToast('Absensi berhasil disimpan!', 'success');
    } catch (error) {
        showToast('Gagal menyimpan: ' + error.message, 'error');
    }
}

// ===== NILAI FUNCTIONS =====
function loadNilai() {
    const kelas = document.getElementById('nilaiKelas').value;
    const rombel = document.getElementById('nilaiRombel').value;
    const semester = document.getElementById('nilaiSemester').value;
    const jenis = document.getElementById('nilaiJenis').value;
    
    if (!kelas) {
        showToast('Pilih kelas terlebih dahulu', 'warning');
        return;
    }
    
    let filtered = siswaData.filter(s => s.kelas === kelas);
    if (rombel) {
        filtered = filtered.filter(s => s.rombel === rombel);
    }
    filtered.sort((a, b) => a.nama.localeCompare(b.nama));
    
    const tbody = document.getElementById('tabelNilai');
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-3 py-8 text-center text-gray-500">Tidak ada siswa</td></tr>';
        return;
    }
    
    // Load existing nilai
    db.collection('users').doc(currentUser.uid)
        .collection('nilai')
        .where('kelas', '==', kelas)
        .where('semester', '==', semester)
        .where('jenis', '==', jenis)
        .get()
        .then(snapshot => {
            const nilaiData = {};
            snapshot.forEach(doc => {
                const data = doc.data();
                nilaiData[data.siswaId] = { nilai: data.nilai, catatan: data.catatan };
            });
            
            tbody.innerHTML = filtered.map((siswa, index) => {
                const existing = nilaiData[siswa.id] || { nilai: '', catatan: '' };
                return `
                    <tr class="hover:bg-gray-50">
                        <td class="px-3 py-2 text-sm text-center">${index + 1}</td>
                        <td class="px-3 py-2 text-sm font-medium">${siswa.nis}</td>
                        <td class="px-3 py-2 text-sm">${siswa.nama}</td>
                        <td class="px-3 py-2 text-center">
                            <input type="number" min="0" max="100" value="${existing.nilai}"
                                class="nilai-input w-20 px-2 py-1.5 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-primary"
                                data-siswa-id="${siswa.id}">
                        </td>
                        <td class="px-3 py-2">
                            <input type="text" value="${existing.catatan || ''}"
                                class="catatan-input w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                                data-siswa-id="${siswa.id}" placeholder="Catatan">
                        </td>
                    </tr>
                `;
            }).join('');
        });
}

async function simpanNilai() {
    const kelas = document.getElementById('nilaiKelas').value;
    const semester = document.getElementById('nilaiSemester').value;
    const jenis = document.getElementById('nilaiJenis').value;
    const rombel = document.getElementById('nilaiRombel').value;
    
    if (!kelas) {
        showToast('Pilih kelas terlebih dahulu', 'warning');
        return;
    }
    
    try {
        showToast('Menyimpan nilai...', 'info');
        
        const batch = db.batch();
        const nilaiRef = db.collection('users').doc(currentUser.uid).collection('nilai');
        
        // Delete existing
        const existingSnapshot = await nilaiRef
            .where('kelas', '==', kelas)
            .where('semester', '==', semester)
            .where('jenis', '==', jenis)
            .get();
        
        existingSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        
        // Save new nilai
        document.querySelectorAll('.nilai-input').forEach(input => {
            const siswaId = input.dataset.siswaId;
            const nilai = input.value;
            const catatanInput = document.querySelector(`.catatan-input[data-siswa-id="${siswaId}"]`);
            const catatan = catatanInput ? catatanInput.value : '';
            const siswa = siswaData.find(s => s.id === siswaId);
            
            if (nilai && siswa) {
                const newDocRef = nilaiRef.doc();
                batch.set(newDocRef, {
                    siswaId: siswaId,
                    siswaNama: siswa.nama,
                    siswaNis: siswa.nis,
                    kelas: kelas,
                    rombel: rombel || '',
                    semester: semester,
                    jenis: jenis,
                    nilai: parseInt(nilai),
                    catatan: catatan,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        });
        
        await batch.commit();
        showToast('Nilai berhasil disimpan!', 'success');
    } catch (error) {
        showToast('Gagal menyimpan: ' + error.message, 'error');
    }
}

// ===== JURNAL FUNCTIONS =====
async function loadJurnal() {
    try {
        const snapshot = await db.collection('users').doc(currentUser.uid)
            .collection('jurnal').orderBy('tanggal', 'desc').limit(20).get();
        
        const container = document.getElementById('listJurnal');
        
        if (snapshot.empty) {
            container.innerHTML = '<p class="text-center text-gray-500 py-8">Belum ada jurnal</p>';
            return;
        }
        
        let html = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            html += `
                <div class="border rounded-lg p-4 hover:bg-gray-50 transition">
                    <div class="flex justify-between items-start mb-2">
                        <div class="flex items-center gap-2">
                            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                                Kelas ${data.kelas}${data.rombel ? '-' + data.rombel : ''}
                            </span>
                        </div>
                        <button onclick="deleteJurnal('${doc.id}')" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash text-sm"></i>
                        </button>
                    </div>
                    <h4 class="font-medium text-gray-800">${data.materi}</h4>
                    <p class="text-xs text-gray-500 mt-1">${formatDate(data.tanggal)}</p>
                    ${data.absensi ? `
                        <div class="mt-2 flex gap-2 text-xs">
                            <span class="bg-green-100 text-green-700 px-2 py-0.5 rounded">H: ${data.absensi.hadir || 0}</span>
                            <span class="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">I: ${data.absensi.izin || 0}</span>
                            <span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">S: ${data.absensi.sakit || 0}</span>
                            <span class="bg-red-100 text-red-700 px-2 py-0.5 rounded">A: ${data.absensi.alpha || 0}</span>
                        </div>
                    ` : ''}
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading jurnal:', error);
    }
}

async function saveJurnal(e) {
    e.preventDefault();
    
    const tanggal = document.getElementById('jurnalTanggal').value;
    const kelas = document.getElementById('jurnalKelas').value;
    const rombel = document.getElementById('jurnalRombel').value;
    
    // Get absensi summary
    let absensiSummary = { hadir: 0, izin: 0, sakit: 0, alpha: 0 };
    
    try {
        const absensiSnapshot = await db.collection('users').doc(currentUser.uid)
            .collection('absensi')
            .where('tanggal', '==', tanggal)
            .where('kelas', '==', kelas)
            .get();
        
        absensiSnapshot.forEach(doc => {
            const status = doc.data().status;
            if (status === 'H') absensiSummary.hadir++;
            else if (status === 'I') absensiSummary.izin++;
            else if (status === 'S') absensiSummary.sakit++;
            else if (status === 'A') absensiSummary.alpha++;
        });
        
        await db.collection('users').doc(currentUser.uid).collection('jurnal').add({
            tanggal: tanggal,
            kelas: kelas,
            rombel: rombel.toUpperCase(),
            jam: document.getElementById('jurnalJam').value,
            materi: document.getElementById('jurnalMateri').value,
            tujuan: document.getElementById('jurnalTujuan').value,
            kegiatan: document.getElementById('jurnalKegiatan').value,
            catatan: document.getElementById('jurnalCatatan').value,
            absensi: absensiSummary,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        document.getElementById('formJurnal').reset();
        setDefaultDates();
        loadJurnal();
        loadDashboardWidgets();
        showToast('Jurnal berhasil disimpan!', 'success');
    } catch (error) {
        showToast('Gagal menyimpan: ' + error.message, 'error');
    }
}

async function deleteJurnal(id) {
    if (!confirm('Yakin ingin menghapus jurnal ini?')) return;
    
    try {
        await db.collection('users').doc(currentUser.uid).collection('jurnal').doc(id).delete();
        loadJurnal();
        loadDashboardWidgets();
        showToast('Jurnal berhasil dihapus', 'success');
    } catch (error) {
        showToast('Gagal menghapus: ' + error.message, 'error');
    }
}

async function updateJurnalAbsenInfo() {
    const tanggal = document.getElementById('jurnalTanggal')?.value;
    const kelas = document.getElementById('jurnalKelas')?.value;
    const infoEl = document.getElementById('jurnalAbsenInfo');
    
    if (!infoEl) return;
    
    if (!tanggal || !kelas) {
        infoEl.textContent = 'Pilih tanggal dan kelas untuk melihat ringkasan absensi';
        return;
    }
    
    try {
        const snapshot = await db.collection('users').doc(currentUser.uid)
            .collection('absensi')
            .where('tanggal', '==', tanggal)
            .where('kelas', '==', kelas)
            .get();
        
        if (snapshot.empty) {
            infoEl.innerHTML = '<span class="text-yellow-600"><i class="fas fa-exclamation-triangle mr-1"></i>Belum ada absensi untuk tanggal dan kelas ini</span>';
            return;
        }
        
        let h = 0, i = 0, s = 0, a = 0;
        snapshot.forEach(doc => {
            const status = doc.data().status;
            if (status === 'H') h++;
            else if (status === 'I') i++;
            else if (status === 'S') s++;
            else if (status === 'A') a++;
        });
        
        infoEl.innerHTML = `
            <span class="font-medium text-blue-800">Ringkasan Absensi:</span>
            <span class="ml-2 text-green-600 font-bold">H: ${h}</span>
            <span class="ml-2 text-yellow-600 font-bold">I: ${i}</span>
            <span class="ml-2 text-blue-600 font-bold">S: ${s}</span>
            <span class="ml-2 text-red-600 font-bold">A: ${a}</span>
        `;
    } catch (error) {
        infoEl.textContent = 'Gagal memuat data absensi';
    }
}

// ===== BANK SOAL FUNCTIONS =====
async function loadBankSoal() {
    try {
        const filterKelas = document.getElementById('filterSoalKelas')?.value || '';
        const snapshot = await db.collection('users').doc(currentUser.uid)
            .collection('banksoal').orderBy('createdAt', 'desc').get();
        
        const container = document.getElementById('listSoal');
        
        if (snapshot.empty) {
            container.innerHTML = '<p class="text-center text-gray-500 py-8">Belum ada soal</p>';
            return;
        }
        
        const tingkatConfig = {
            mudah: { bg: 'bg-green-100', text: 'text-green-800' },
            sedang: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
            sulit: { bg: 'bg-red-100', text: 'text-red-800' }
        };
        
        let html = '';
        let count = 0;
        
        snapshot.forEach(doc => {
            const data = doc.data();
            
            if (filterKelas && data.kelas !== filterKelas) return;
            
            count++;
            const tingkat = tingkatConfig[data.tingkat] || tingkatConfig.sedang;
            
            html += `
                <div class="border rounded-lg p-4 hover:bg-gray-50 transition">
                    <div class="flex justify-between items-start mb-2">
                        <div class="flex flex-wrap gap-1">
                            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Kelas ${data.kelas}</span>
                            <span class="text-xs ${tingkat.bg} ${tingkat.text} px-2 py-0.5 rounded-full capitalize">${data.tingkat}</span>
                        </div>
                        <button onclick="deleteSoal('${doc.id}')" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash text-sm"></i>
                        </button>
                    </div>
                    <p class="text-xs text-gray-500 mb-1">${data.materi}</p>
                    <p class="font-arabic text-sm line-clamp-2" dir="auto">${data.teks}</p>
                </div>
            `;
        });
        
        container.innerHTML = html || '<p class="text-center text-gray-500 py-8">Tidak ada soal untuk kelas ini</p>';
        
        // Update stats
        document.getElementById('statSoal').textContent = count;
    } catch (error) {
        console.error('Error loading bank soal:', error);
    }
}

async function saveSoal(e) {
    e.preventDefault();
    
    try {
        const soalData = {
            fase: document.getElementById('soalFase').value,
            kelas: document.getElementById('soalKelas').value,
            jenis: document.getElementById('soalJenis').value,
            tingkat: document.getElementById('soalTingkat').value,
            materi: document.getElementById('soalMateri').value,
            teks: document.getElementById('soalTeks').value,
            kunci: document.getElementById('soalKunci').value,
            pembahasan: document.getElementById('soalPembahasan').value,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        if (soalData.jenis === 'pg') {
            soalData.opsiA = document.getElementById('soalOpsiA').value;
            soalData.opsiB = document.getElementById('soalOpsiB').value;
            soalData.opsiC = document.getElementById('soalOpsiC').value;
            soalData.opsiD = document.getElementById('soalOpsiD').value;
        }
        
        await db.collection('users').doc(currentUser.uid).collection('banksoal').add(soalData);
        
        document.getElementById('formSoal').reset();
        loadBankSoal();
        updateStats();
        showToast('Soal berhasil disimpan!', 'success');
    } catch (error) {
        showToast('Gagal menyimpan: ' + error.message, 'error');
    }
}

async function deleteSoal(id) {
    if (!confirm('Yakin ingin menghapus soal ini?')) return;
    
    try {
        await db.collection('users').doc(currentUser.uid).collection('banksoal').doc(id).delete();
        loadBankSoal();
        updateStats();
        showToast('Soal berhasil dihapus', 'success');
    } catch (error) {
        showToast('Gagal menghapus: ' + error.message, 'error');
    }
}

// ===== LKPD FUNCTIONS =====
function tambahLangkah() {
    langkahCount++;
    const container = document.getElementById('langkahContainer');
    const div = document.createElement('div');
    div.className = 'flex gap-2 items-center';
    div.innerHTML = `
        <span class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">${langkahCount}</span>
        <input type="text" name="langkah[]" required placeholder="Langkah ${langkahCount}..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
        <button type="button" onclick="this.parentElement.remove()" class="text-red-500 hover:text-red-700 p-2">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(div);
}

async function loadLKPD() {
    try {
        const snapshot = await db.collection('users').doc(currentUser.uid)
            .collection('lkpd').orderBy('createdAt', 'desc').get();
        
        const container = document.getElementById('listLKPD');
        
        if (snapshot.empty) {
            container.innerHTML = '<p class="text-center text-gray-500 py-8">Belum ada LKPD</p>';
            return;
        }
        
        let html = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            html += `
                <div class="border rounded-lg p-4 hover:bg-gray-50 transition">
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
                            Fase ${data.fase} • Kelas ${data.kelas}
                        </span>
                        <div class="flex gap-1">
                            <button onclick="previewLKPD('${doc.id}')" class="text-blue-500 hover:text-blue-700 p-1" title="Preview">
                                <i class="fas fa-eye text-sm"></i>
                            </button>
                            <button onclick="deleteLKPD('${doc.id}')" class="text-red-500 hover:text-red-700 p-1" title="Hapus">
                                <i class="fas fa-trash text-sm"></i>
                            </button>
                        </div>
                    </div>
                    <h4 class="font-medium text-gray-800">${data.judul}</h4>
                    <p class="text-xs text-gray-500 mt-1">${data.waktu || '-'}</p>
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading LKPD:', error);
    }
}

async function saveLKPD(e) {
    e.preventDefault();
    
    const langkahInputs = document.querySelectorAll('input[name="langkah[]"]');
    const langkah = Array.from(langkahInputs).map(input => input.value).filter(v => v);
    
    try {
        await db.collection('users').doc(currentUser.uid).collection('lkpd').add({
            fase: document.getElementById('lkpdFase').value,
            kelas: document.getElementById('lkpdKelas').value,
            waktu: document.getElementById('lkpdWaktu').value,
            judul: document.getElementById('lkpdJudul').value,
            tujuan: document.getElementById('lkpdTujuan').value,
            materi: document.getElementById('lkpdMateri').value,
            langkah: langkah,
            kegiatan: document.getElementById('lkpdKegiatan').value,
            rubrik: document.getElementById('lkpdRubrik').value,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        document.getElementById('formLKPD').reset();
        // Reset langkah
        document.getElementById('langkahContainer').innerHTML = `
            <div class="flex gap-2 items-center">
                <span class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">1</span>
                <input type="text" name="langkah[]" required placeholder="Langkah pertama..."
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
            </div>
        `;
        langkahCount = 1;
        
        loadLKPD();
        showToast('LKPD berhasil disimpan!', 'success');
    } catch (error) {
        showToast('Gagal menyimpan: ' + error.message, 'error');
    }
}

async function deleteLKPD(id) {
    if (!confirm('Yakin ingin menghapus LKPD ini?')) return;
    
    try {
        await db.collection('users').doc(currentUser.uid).collection('lkpd').doc(id).delete();
        loadLKPD();
        showToast('LKPD berhasil dihapus', 'success');
    } catch (error) {
        showToast('Gagal menghapus: ' + error.message, 'error');
    }
}

async function previewLKPD(id) {
    try {
        const doc = await db.collection('users').doc(currentUser.uid)
            .collection('lkpd').doc(id).get();
        
        if (!doc.exists) {
            showToast('LKPD tidak ditemukan', 'error');
            return;
        }
        
        const data = doc.data();
        const content = `
            <div class="doc-preview">
                <h1>LEMBAR KERJA PESERTA DIDIK (LKPD)</h1>
                
                <table>
                    <tr><td width="180">Mata Pelajaran</td><td>: Pendidikan Agama Islam dan Budi Pekerti</td></tr>
                    <tr><td>Fase / Kelas</td><td>: ${data.fase} / ${data.kelas}</td></tr>
                    <tr><td>Alokasi Waktu</td><td>: ${data.waktu || '-'}</td></tr>
                </table>
                
                <h2>Judul: ${data.judul}</h2>
                
                <h2>A. Tujuan Pembelajaran</h2>
                <p>${data.tujuan}</p>
                
                <h2>B. Uraian Materi</h2>
                <div class="arabic" dir="auto">${data.materi}</div>
                
                <h2>C. Langkah-langkah Pengerjaan</h2>
                <ol>${data.langkah.map(l => `<li>${l}</li>`).join('')}</ol>
                
                <h2>D. Kegiatan</h2>
                <div class="arabic" dir="auto">${data.kegiatan}</div>
                
                ${data.rubrik ? `<h2>E. Rubrik Penilaian</h2><p>${data.rubrik}</p>` : ''}
            </div>
        `;
        
        document.getElementById('previewTitle').textContent = 'Preview LKPD';
        document.getElementById('previewContent').innerHTML = content;
        openModal('modalPreview');
    } catch (error) {
        showToast('Gagal memuat: ' + error.message, 'error');
    }
}

// ===== UTILITY FUNCTIONS =====
async function updateStats() {
    try {
        document.getElementById('statSiswa').textContent = siswaData.length;
        
        const kelasSet = new Set(siswaData.map(s => s.kelas));
        document.getElementById('statKelas').textContent = kelasSet.size;
        
        const soalSnapshot = await db.collection('users').doc(currentUser.uid)
            .collection('banksoal').get();
        document.getElementById('statSoal').textContent = soalSnapshot.size;
        
        const modulSnapshot = await db.collection('users').doc(currentUser.uid)
            .collection('dokumen').get();
        document.getElementById('statModul').textContent = modulSnapshot.size;
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

function formatDateLong(dateString) {
    if (!dateString) return '-';
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function printPreview() {
    window.print();
}

// ===== DIMENSI PROFIL FUNCTIONS =====
function showDimensiDetail(dimensiId) {
    const dimensi = getDimensiById(dimensiId);
    if (!dimensi) {
        showToast('Dimensi tidak ditemukan', 'error');
        return;
    }
    
    const header = document.getElementById('modalDimensiHeader');
    header.className = `p-4 text-white bg-gradient-to-r ${dimensi.color}`;
    
    document.getElementById('modalDimensiIcon').className = `fas ${dimensi.icon} text-xl`;
    document.getElementById('modalDimensiTitle').textContent = dimensi.nama;
    document.getElementById('modalDimensiDesc').textContent = dimensi.deskripsi;
    
    const indikatorContainer = document.getElementById('modalDimensiIndikator');
    indikatorContainer.innerHTML = dimensi.indikator.map(ind => `
        <li class="flex items-start gap-2">
            <i class="fas fa-check-circle text-green-500 mt-0.5 flex-shrink-0"></i>
            <span class="text-gray-700">${ind}</span>
        </li>
    `).join('');
    
    const faseContainer = document.getElementById('modalDimensiFase');
    let faseHTML = '';
    
    ['A', 'B', 'C'].forEach(fase => {
        const cpData = DATA_CP[fase];
        if (!cpData) return;
        
        const dimensiFase = cpData.dimensiProfil.find(dp => dp.dimensi === dimensiId);
        
        if (dimensiFase) {
            const faseColors = {
                'A': 'bg-blue-50 border-blue-200',
                'B': 'bg-green-50 border-green-200',
                'C': 'bg-purple-50 border-purple-200'
            };
            
            faseHTML += `
                <div class="border rounded-lg p-3 ${faseColors[fase]}">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-xs font-bold bg-white px-2 py-0.5 rounded">Fase ${fase}</span>
                        <span class="text-xs text-gray-500">${cpData.kelas}</span>
                    </div>
                    <p class="text-sm text-gray-700">${dimensiFase.deskripsi}</p>
                </div>
            `;
        }
    });
    
    faseContainer.innerHTML = faseHTML;
    openModal('modalDimensi');
}

// Continue in next part...
console.log('✅ Admin PAI Super App - Core modules loaded');
// ==========================================
// GENERATOR DOKUMEN FUNCTIONS
// ==========================================

// ===== LOAD CP BY FASE =====
function loadCPByFase() {
    const fase = document.getElementById('genFase').value;
    const container = document.getElementById('listCP');
    
    if (!fase) {
        container.innerHTML = `
            <div class="text-center text-gray-500 py-8">
                <i class="fas fa-hand-pointer text-4xl text-gray-300 mb-2"></i>
                <p>Pilih Fase terlebih dahulu untuk menampilkan Capaian Pembelajaran</p>
            </div>
        `;
        return;
    }
    
    const cpData = DATA_CP[fase];
    if (!cpData) {
        container.innerHTML = '<p class="text-center text-red-500 py-4">Data CP tidak ditemukan</p>';
        return;
    }
    
    let html = `
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 mb-6">
            <div class="flex items-start gap-3">
                <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-bullseye text-white text-xl"></i>
                </div>
                <div>
                    <h4 class="font-bold text-blue-800 text-lg">${cpData.fase} (${cpData.kelas})</h4>
                    <p class="text-sm text-blue-700 mt-2 leading-relaxed">${cpData.deskripsi}</p>
                </div>
            </div>
        </div>
        
        <h3 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <i class="fas fa-layer-group text-primary"></i>
            Elemen Capaian Pembelajaran
        </h3>
    `;
    
    // Render elemen CP
    cpData.elemen.forEach((elemen, index) => {
        html += `
            <div class="border rounded-xl p-4 mb-3 hover:border-primary transition bg-white">
                <div class="flex items-start gap-3">
                    <input type="checkbox" id="cp_${index}" name="selectedCP" value="${index}" 
                        class="mt-1 w-5 h-5 rounded text-primary focus:ring-primary" checked>
                    <div class="flex-1">
                        <label for="cp_${index}" class="font-semibold text-gray-800 cursor-pointer hover:text-primary transition">
                            ${elemen.nama}
                        </label>
                        <p class="text-sm text-gray-600 mt-2 leading-relaxed">${elemen.cp}</p>
                        <div class="mt-3">
                            <p class="text-xs text-gray-500 font-medium mb-2">
                                <i class="fas fa-book-open mr-1"></i>Materi Pokok:
                            </p>
                            <div class="flex flex-wrap gap-1.5">
                                ${elemen.materi.map(m => `
                                    <span class="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">${m}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Render 8 Dimensi Profil Lulusan untuk fase ini
    html += `
        <div class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 mt-6">
            <h4 class="font-bold text-amber-800 mb-4 flex items-center gap-2">
                <i class="fas fa-award"></i>
                8 Dimensi Profil Lulusan - ${cpData.fase}
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
    `;
    
    cpData.dimensiProfil.forEach(dp => {
        const dimensiInfo = getDimensiById(dp.dimensi);
        if (dimensiInfo) {
            html += `
                <div class="bg-white rounded-lg p-3 border border-amber-100">
                    <div class="flex items-center gap-2 mb-1.5">
                        <div class="w-7 h-7 bg-gradient-to-r ${dimensiInfo.color} rounded-full flex items-center justify-center">
                            <i class="fas ${dimensiInfo.icon} text-white text-xs"></i>
                        </div>
                        <span class="text-sm font-semibold text-gray-800">${dimensiInfo.nama}</span>
                    </div>
                    <p class="text-xs text-gray-600 leading-relaxed">${dp.deskripsi}</p>
                </div>
            `;
        }
    });
    
    html += `
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// ===== TAMBAH TUJUAN PEMBELAJARAN =====
function tambahTP() {
    tpCount++;
    const container = document.getElementById('containerTP');
    const div = document.createElement('div');
    div.className = 'bg-gray-50 rounded-lg p-4 tp-item';
    div.innerHTML = `
        <div class="flex justify-between items-center mb-3">
            <span class="text-sm font-semibold text-gray-600 bg-white px-3 py-1 rounded-full">TP ${tpCount}</span>
            <button type="button" onclick="this.closest('.tp-item').remove()" class="text-red-500 hover:text-red-700 p-1">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="grid lg:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tujuan Pembelajaran</label>
                <textarea name="tp[]" rows="2" required placeholder="Peserta didik mampu..."
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Alokasi Waktu</label>
                    <input type="text" name="tpWaktu[]" placeholder="4 JP" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Dimensi Profil</label>
                    <select name="tpDimensi[]" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                        <option value="keimanan">Keimanan & Ketakwaan</option>
                        <option value="kewargaan">Kewargaan</option>
                        <option value="penalaran">Penalaran Kritis</option>
                        <option value="kreativitas">Kreativitas</option>
                        <option value="kolaborasi">Kolaborasi</option>
                        <option value="kemandirian">Kemandirian</option>
                        <option value="kesehatan">Kesehatan</option>
                        <option value="komunikasi">Komunikasi</option>
                    </select>
                </div>
            </div>
        </div>
    `;
    container.appendChild(div);
}

// ===== GENERATE DOCUMENTS =====
async function generateDocuments(e) {
    e.preventDefault();
    
    const fase = document.getElementById('genFase').value;
    const kelas = document.getElementById('genKelas').value;
    const tahun = document.getElementById('genTahun').value;
    const semester = document.getElementById('genSemester').value;
    const judulModul = document.getElementById('genJudulModul').value;
    
    if (!fase || !kelas || !tahun || !judulModul) {
        showToast('Lengkapi semua informasi yang diperlukan', 'warning');
        return;
    }
    
    showToast('Generating dokumen... Mohon tunggu', 'info');
    
    try {
        // Get selected CP
        const selectedCP = [];
        document.querySelectorAll('input[name="selectedCP"]:checked').forEach(cb => {
            selectedCP.push(parseInt(cb.value));
        });
        
        if (selectedCP.length === 0) {
            showToast('Pilih minimal satu Capaian Pembelajaran', 'warning');
            return;
        }
        
        // Get TP data
        const tpElements = document.querySelectorAll('textarea[name="tp[]"]');
        const tpWaktuElements = document.querySelectorAll('input[name="tpWaktu[]"]');
        const tpDimensiElements = document.querySelectorAll('select[name="tpDimensi[]"]');
        
        const tpData = [];
        tpElements.forEach((el, i) => {
            if (el.value.trim()) {
                const dimensiId = tpDimensiElements[i]?.value || 'keimanan';
                const dimensiInfo = getDimensiById(dimensiId);
                tpData.push({
                    tujuan: el.value.trim(),
                    waktu: tpWaktuElements[i]?.value || '4 JP',
                    dimensi: dimensiId,
                    dimensiNama: dimensiInfo?.nama || dimensiId
                });
            }
        });
        
        if (tpData.length === 0) {
            showToast('Tambahkan minimal satu Tujuan Pembelajaran', 'warning');
            return;
        }
        
        // Get settings data
        let satdikData = {};
        let kepsekData = {};
        
        const satdikDoc = await db.collection('users').doc(currentUser.uid)
            .collection('settings').doc('satdik').get();
        if (satdikDoc.exists) satdikData = satdikDoc.data();
        
        const kepsekDoc = await db.collection('users').doc(currentUser.uid)
            .collection('settings').doc('kepsek').get();
        if (kepsekDoc.exists) kepsekData = kepsekDoc.data();
        
        // Build generated docs object
        const cpData = DATA_CP[fase];
        
        generatedDocs = {
            info: {
                fase,
                kelas,
                tahun,
                semester,
                satdik: satdikData,
                kepsek: kepsekData,
                guru: {
                    nama: currentUserData?.nama || '',
                    nip: currentUserData?.nip || ''
                },
                tanggalGenerate: new Date().toISOString()
            },
            cp: cpData,
            selectedCP: selectedCP.map(i => cpData.elemen[i]),
            tp: tpData,
            modul: {
                judul: judulModul,
                materi: document.getElementById('genMateri').value,
                pendahuluan: document.getElementById('genPendahuluan').value,
                inti: document.getElementById('genInti').value,
                penutup: document.getElementById('genPenutup').value,
                asesmen: document.getElementById('genAsesmen').value
            }
        };
        
        // Save to Firestore
        await db.collection('users').doc(currentUser.uid).collection('dokumen').add({
            ...generatedDocs,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Show results
        document.getElementById('hasilGenerator').classList.remove('hidden');
        
        // Scroll to results
        document.getElementById('hasilGenerator').scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        updateStats();
        showToast('Semua dokumen berhasil di-generate!', 'success');
        
    } catch (error) {
        console.error('Generate error:', error);
        showToast('Gagal generate dokumen: ' + error.message, 'error');
    }
}

// ===== PREVIEW DOCUMENTS =====
function previewDoc(type) {
    if (!generatedDocs || !generatedDocs.info) {
        showToast('Generate dokumen terlebih dahulu', 'warning');
        return;
    }
    
    let content = '';
    const info = generatedDocs.info;
    const semesterText = info.semester === '1' ? 'Ganjil' : 'Genap';
    
    // Generate document header
    const header = generateDocHeader(info);
    
    switch(type) {
        case 'atp':
            content = generateATPContent(header, info, semesterText);
            document.getElementById('previewTitle').textContent = 'Preview ATP (Alur Tujuan Pembelajaran)';
            break;
        case 'prota':
            content = generateProtaContent(header, info, semesterText);
            document.getElementById('previewTitle').textContent = 'Preview Prota (Program Tahunan)';
            break;
        case 'promes':
            content = generatePromesContent(header, info, semesterText);
            document.getElementById('previewTitle').textContent = 'Preview Promes (Program Semester)';
            break;
        case 'modul':
            content = generateModulContent(header, info, semesterText);
            document.getElementById('previewTitle').textContent = 'Preview Modul Ajar';
            break;
    }
    
    document.getElementById('previewContent').innerHTML = content;
    openModal('modalPreview');
}

// ===== DOCUMENT HEADER =====
function generateDocHeader(info) {
    return `
        <div style="text-align: center; margin-bottom: 25px; border-bottom: 3px double #000; padding-bottom: 15px;">
            <h2 style="margin: 0; font-size: 14pt; font-weight: bold;">${info.satdik.nama || 'NAMA SEKOLAH'}</h2>
            <p style="margin: 5px 0; font-size: 11pt;">${info.satdik.alamat || 'Alamat Sekolah'}</p>
            <p style="margin: 5px 0; font-size: 11pt;">
                ${[info.satdik.kecamatan, info.satdik.kabupaten, info.satdik.provinsi].filter(x => x).join(', ') || 'Kecamatan, Kabupaten, Provinsi'}
            </p>
            ${info.satdik.npsn ? `<p style="margin: 5px 0; font-size: 10pt;">NPSN: ${info.satdik.npsn}</p>` : ''}
        </div>
    `;
}

// ===== DOCUMENT SIGNATURE =====
function generateSignature(info) {
    const today = new Date();
    const tanggal = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    
    return `
        <div style="margin-top: 50px; display: flex; justify-content: space-between; page-break-inside: avoid;">
            <div style="text-align: center; width: 45%;">
                <p style="margin-bottom: 5px;">Mengetahui,</p>
                <p style="margin-bottom: 70px;">Kepala Sekolah</p>
                <p style="margin: 0; font-weight: bold; text-decoration: underline;">${info.kepsek.nama || '................................'}</p>
                <p style="margin: 0;">NIP. ${info.kepsek.nip || '................................'}</p>
            </div>
            <div style="text-align: center; width: 45%;">
                <p style="margin-bottom: 5px;">${info.satdik.kabupaten || '...............'}, ${tanggal}</p>
                <p style="margin-bottom: 70px;">Guru Mata Pelajaran</p>
                <p style="margin: 0; font-weight: bold; text-decoration: underline;">${info.guru.nama || '................................'}</p>
                <p style="margin: 0;">NIP. ${info.guru.nip || '................................'}</p>
            </div>
        </div>
    `;
}

// ===== ATP CONTENT =====
function generateATPContent(header, info, semesterText) {
    const dimensiList = generatedDocs.cp.dimensiProfil.map(dp => {
        const dimensiInfo = getDimensiById(dp.dimensi);
        return dimensiInfo?.nama || dp.dimensi;
    });
    
    return `
        <div class="doc-preview">
            ${header}
            
            <h1>ALUR TUJUAN PEMBELAJARAN (ATP)</h1>
            
            <table style="margin-bottom: 20px;">
                <tr>
                    <td width="180" style="border: none; padding: 3px 0;">Satuan Pendidikan</td>
                    <td style="border: none; padding: 3px 0;">: ${info.satdik.nama || '-'}</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 3px 0;">Mata Pelajaran</td>
                    <td style="border: none; padding: 3px 0;">: Pendidikan Agama Islam dan Budi Pekerti</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 3px 0;">Fase / Kelas</td>
                    <td style="border: none; padding: 3px 0;">: ${info.fase} / ${info.kelas}</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 3px 0;">Tahun Pelajaran</td>
                    <td style="border: none; padding: 3px 0;">: ${info.tahun}</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 3px 0;">Penyusun</td>
                    <td style="border: none; padding: 3px 0;">: ${info.guru.nama || '-'}</td>
                </tr>
            </table>
            
            <h2>A. CAPAIAN PEMBELAJARAN</h2>
            <p style="text-align: justify;">${generatedDocs.cp.deskripsi}</p>
            
            <h2>B. ELEMEN DAN CAPAIAN PEMBELAJARAN</h2>
            <table>
                <thead>
                    <tr>
                        <th width="40">No</th>
                        <th width="150">Elemen</th>
                        <th>Capaian Pembelajaran</th>
                    </tr>
                </thead>
                <tbody>
                    ${generatedDocs.selectedCP.map((cp, i) => `
                        <tr>
                            <td style="text-align: center;">${i + 1}</td>
                            <td>${cp.nama}</td>
                            <td style="text-align: justify;">${cp.cp}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <h2>C. ALUR TUJUAN PEMBELAJARAN</h2>
            <table>
                <thead>
                    <tr>
                        <th width="40">No</th>
                        <th>Tujuan Pembelajaran</th>
                        <th width="80">Alokasi Waktu</th>
                        <th width="150">Dimensi Profil Lulusan</th>
                    </tr>
                </thead>
                <tbody>
                    ${generatedDocs.tp.map((tp, i) => `
                        <tr>
                            <td style="text-align: center;">${i + 1}</td>
                            <td style="text-align: justify;">${tp.tujuan}</td>
                            <td style="text-align: center;">${tp.waktu}</td>
                            <td>${tp.dimensiNama}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <h2>D. DIMENSI PROFIL LULUSAN</h2>
            <ol>
                ${dimensiList.map(d => `<li>${d}</li>`).join('')}
            </ol>
            
            ${generateSignature(info)}
        </div>
    `;
}

// ===== PROTA CONTENT =====
function generateProtaContent(header, info, semesterText) {
    // Bagi TP menjadi 2 semester
    const halfIndex = Math.ceil(generatedDocs.tp.length / 2);
    const tpSem1 = generatedDocs.tp.slice(0, halfIndex);
    const tpSem2 = generatedDocs.tp.slice(halfIndex);
    
    // Hitung total JP
    const calculateTotalJP = (tpList) => {
        return tpList.reduce((total, tp) => {
            const jp = parseInt(tp.waktu) || 4;
            return total + jp;
        }, 0);
    };
    
    return `
        <div class="doc-preview">
            ${header}
            
            <h1>PROGRAM TAHUNAN (PROTA)</h1>
            
            <table style="margin-bottom: 20px;">
                <tr>
                    <td width="180" style="border: none; padding: 3px 0;">Satuan Pendidikan</td>
                    <td style="border: none; padding: 3px 0;">: ${info.satdik.nama || '-'}</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 3px 0;">Mata Pelajaran</td>
                    <td style="border: none; padding: 3px 0;">: Pendidikan Agama Islam dan Budi Pekerti</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 3px 0;">Kelas</td>
                    <td style="border: none; padding: 3px 0;">: ${info.kelas}</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 3px 0;">Tahun Pelajaran</td>
                    <td style="border: none; padding: 3px 0;">: ${info.tahun}</td>
                </tr>
            </table>
            
            <h2>SEMESTER 1 (GANJIL)</h2>
            <table>
                <thead>
                    <tr>
                        <th width="40">No</th>
                        <th>Tujuan Pembelajaran / Materi</th>
                        <th width="100">Alokasi Waktu</th>
                        <th width="120">Keterangan</th>
                    </tr>
                </thead>
                <tbody>
                    ${tpSem1.map((tp, i) => `
                        <tr>
                            <td style="text-align: center;">${i + 1}</td>
                            <td style="text-align: justify;">${tp.tujuan}</td>
                            <td style="text-align: center;">${tp.waktu}</td>
                            <td></td>
                        </tr>
                    `).join('')}
                    <tr style="font-weight: bold; background-color: #f5f5f5;">
                        <td colspan="2" style="text-align: right;">Total Jam Pelajaran Semester 1</td>
                        <td style="text-align: center;">${calculateTotalJP(tpSem1)} JP</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            
            <h2>SEMESTER 2 (GENAP)</h2>
            <table>
                <thead>
                    <tr>
                        <th width="40">No</th>
                        <th>Tujuan Pembelajaran / Materi</th>
                        <th width="100">Alokasi Waktu</th>
                        <th width="120">Keterangan</th>
                    </tr>
                </thead>
                <tbody>
                    ${tpSem2.length > 0 ? tpSem2.map((tp, i) => `
                        <tr>
                            <td style="text-align: center;">${i + 1}</td>
                            <td style="text-align: justify;">${tp.tujuan}</td>
                            <td style="text-align: center;">${tp.waktu}</td>
                            <td></td>
                        </tr>
                    `).join('') : `
                        <tr>
                            <td colspan="4" style="text-align: center; color: #666;">
                                (Tambahkan Tujuan Pembelajaran untuk Semester 2)
                            </td>
                        </tr>
                    `}
                    <tr style="font-weight: bold; background-color: #f5f5f5;">
                        <td colspan="2" style="text-align: right;">Total Jam Pelajaran Semester 2</td>
                        <td style="text-align: center;">${calculateTotalJP(tpSem2)} JP</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border: 1px solid #ddd;">
                <p style="margin: 0;"><strong>Total Jam Pelajaran 1 Tahun: ${calculateTotalJP(generatedDocs.tp)} JP</strong></p>
            </div>
            
            ${generateSignature(info)}
        </div>
    `;
}

// ===== PROMES CONTENT =====
function generatePromesContent(header, info, semesterText) {
    const bulanSem1 = ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const bulanSem2 = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];
    const bulan = info.semester === '1' ? bulanSem1 : bulanSem2;
    
    // Hitung total JP
    const totalJP = generatedDocs.tp.reduce((total, tp) => {
        const jp = parseInt(tp.waktu) || 4;
        return total + jp;
    }, 0);
    
    return `
        <div class="doc-preview">
            ${header}
            
            <h1>PROGRAM SEMESTER (PROMES)</h1>
            
            <table style="margin-bottom: 20px;">
                <tr>
                    <td width="180" style="border: none; padding: 3px 0;">Satuan Pendidikan</td>
                    <td style="border: none; padding: 3px 0;">: ${info.satdik.nama || '-'}</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 3px 0;">Mata Pelajaran</td>
                    <td style="border: none; padding: 3px 0;">: Pendidikan Agama Islam dan Budi Pekerti</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 3px 0;">Kelas</td>
                    <td style="border: none; padding: 3px 0;">: ${info.kelas}</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 3px 0;">Semester</td>
                    <td style="border: none; padding: 3px 0;">: ${semesterText}</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 3px 0;">Tahun Pelajaran</td>
                    <td style="border: none; padding: 3px 0;">: ${info.tahun}</td>
                </tr>
            </table>
            
            <table style="font-size: 9pt;">
                <thead>
                    <tr>
                        <th rowspan="2" width="30" style="vertical-align: middle;">No</th>
                        <th rowspan="2" style="vertical-align: middle;">Tujuan Pembelajaran</th>
                        <th rowspan="2" width="40" style="vertical-align: middle;">JP</th>
                        <th colspan="6" style="text-align: center;">Bulan</th>
                        <th rowspan="2" width="60" style="vertical-align: middle;">Ket</th>
                    </tr>
                    <tr>
                        ${bulan.map(b => `<th width="50" style="font-size: 8pt;">${b.substring(0, 3)}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${generatedDocs.tp.map((tp, i) => {
                        // Distribute check marks across months
                        const monthIndex = i % bulan.length;
                        return `
                            <tr>
                                <td style="text-align: center;">${i + 1}</td>
                                <td style="text-align: justify; font-size: 9pt;">${tp.tujuan}</td>
                                <td style="text-align: center;">${parseInt(tp.waktu) || 4}</td>
                                ${bulan.map((_, bi) => `
                                    <td style="text-align: center;">${bi === monthIndex ? '✓' : ''}</td>
                                `).join('')}
                                <td></td>
                            </tr>
                        `;
                    }).join('')}
                    <tr style="font-weight: bold; background-color: #f5f5f5;">
                        <td colspan="2" style="text-align: right;">Jumlah</td>
                        <td style="text-align: center;">${totalJP}</td>
                        <td colspan="7"></td>
                    </tr>
                </tbody>
            </table>
            
            <div style="margin-top: 20px;">
                <p><strong>Keterangan:</strong></p>
                <ul style="margin-left: 20px;">
                    <li>✓ = Pelaksanaan pembelajaran</li>
                    <li>JP = Jam Pelajaran</li>
                </ul>
            </div>
            
            ${generateSignature(info)}
        </div>
    `;
}

// ===== MODUL AJAR CONTENT =====
function generateModulContent(header, info, semesterText) {
    const modul = generatedDocs.modul;
    
    // Get dimensi for this fase
    const dimensiList = generatedDocs.cp.dimensiProfil.map(dp => {
        const dimensiInfo = getDimensiById(dp.dimensi);
        return {
            nama: dimensiInfo?.nama || dp.dimensi,
            deskripsi: dp.deskripsi
        };
    });
    
    // Get materi from selected CP
    const materiList = [];
    generatedDocs.selectedCP.forEach(cp => {
        cp.materi.forEach(m => {
            if (!materiList.includes(m)) materiList.push(m);
        });
    });
    
    return `
        <div class="doc-preview">
            ${header}
            
            <h1>MODUL AJAR</h1>
            <h2 style="text-align: center; margin-bottom: 20px;">${modul.judul || 'Judul Modul'}</h2>
            
            <h2>A. INFORMASI UMUM</h2>
            <table style="margin-bottom: 15px;">
                <tr>
                    <td width="180" style="border: none; padding: 3px 0;">Satuan Pendidikan</td>
                    <td style="border: none; padding: 3px 0;">: ${info.satdik.nama || '-'}</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 3px 0;">Mata Pelajaran</td>
                    <td style="border: none; padding: 3px 0;">: Pendidikan Agama Islam dan Budi Pekerti</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 3px 0;">Fase / Kelas</td>
                    <td style="border: none; padding: 3px 0;">: ${info.fase} / ${info.kelas}</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 3px 0;">Alokasi Waktu</td>
                    <td style="border: none; padding: 3px 0;">: ${generatedDocs.tp[0]?.waktu || '4 JP'}</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 3px 0;">Tahun Pelajaran</td>
                    <td style="border: none; padding: 3px 0;">: ${info.tahun}</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 3px 0;">Penyusun</td>
                    <td style="border: none; padding: 3px 0;">: ${info.guru.nama || '-'}</td>
                </tr>
            </table>
            
            <h2>B. CAPAIAN PEMBELAJARAN</h2>
            <p style="text-align: justify;">${generatedDocs.cp.deskripsi}</p>
            
            <h2>C. TUJUAN PEMBELAJARAN</h2>
            <p>Setelah mengikuti pembelajaran ini, peserta didik diharapkan mampu:</p>
            <ol>
                ${generatedDocs.tp.map(tp => `<li style="text-align: justify;">${tp.tujuan}</li>`).join('')}
            </ol>
            
            <h2>D. PROFIL PELAJAR PANCASILA / DIMENSI PROFIL LULUSAN</h2>
            <table>
                <thead>
                    <tr>
                        <th width="40">No</th>
                        <th width="200">Dimensi</th>
                        <th>Deskripsi</th>
                    </tr>
                </thead>
                <tbody>
                    ${dimensiList.map((d, i) => `
                        <tr>
                            <td style="text-align: center;">${i + 1}</td>
                            <td>${d.nama}</td>
                            <td style="text-align: justify;">${d.deskripsi}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <h2>E. MATERI PEMBELAJARAN</h2>
            ${modul.materi ? `
                <div class="arabic" dir="auto" style="padding: 15px; background-color: #f9f9f9; border-radius: 5px; margin-bottom: 15px;">
                    ${modul.materi}
                </div>
            ` : ''}
            <p><strong>Materi Pokok:</strong></p>
            <ul>
                ${materiList.slice(0, 5).map(m => `<li>${m}</li>`).join('')}
            </ul>
            
            <h2>F. KEGIATAN PEMBELAJARAN</h2>
            
            <h3>1. Kegiatan Pendahuluan (±10 menit)</h3>
            <ul>
                ${modul.pendahuluan ? modul.pendahuluan.split('\n').filter(x => x.trim()).map(x => `<li>${x.trim()}</li>`).join('') : `
                    <li>Guru mengucapkan salam dan mengajak peserta didik berdoa bersama</li>
                    <li>Guru memeriksa kehadiran peserta didik</li>
                    <li>Guru menyampaikan tujuan pembelajaran yang akan dicapai</li>
                    <li>Guru memberikan apersepsi dan motivasi kepada peserta didik</li>
                `}
            </ul>
            
            <h3>2. Kegiatan Inti (±50 menit)</h3>
            <ul>
                ${modul.inti ? modul.inti.split('\n').filter(x => x.trim()).map(x => `<li>${x.trim()}</li>`).join('') : `
                    <li>Peserta didik mengamati dan menyimak materi yang disampaikan guru</li>
                    <li>Peserta didik bertanya tentang materi yang belum dipahami</li>
                    <li>Peserta didik berdiskusi dalam kelompok kecil</li>
                    <li>Peserta didik mempresentasikan hasil diskusi</li>
                    <li>Guru memberikan penguatan dan klarifikasi</li>
                `}
            </ul>
            
            <h3>3. Kegiatan Penutup (±10 menit)</h3>
            <ul>
                ${modul.penutup ? modul.penutup.split('\n').filter(x => x.trim()).map(x => `<li>${x.trim()}</li>`).join('') : `
                    <li>Guru bersama peserta didik menyimpulkan materi pembelajaran</li>
                    <li>Guru melakukan refleksi terhadap proses pembelajaran</li>
                    <li>Guru memberikan tugas tindak lanjut</li>
                    <li>Guru menutup pembelajaran dengan doa dan salam</li>
                `}
            </ul>
            
            <h2>G. ASESMEN</h2>
            <table>
                <thead>
                    <tr>
                        <th width="40">No</th>
                        <th>Jenis Asesmen</th>
                        <th>Teknik</th>
                        <th>Bentuk Instrumen</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="text-align: center;">1</td>
                        <td>Sikap Spiritual</td>
                        <td>Observasi</td>
                        <td>Jurnal Sikap</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;">2</td>
                        <td>Sikap Sosial</td>
                        <td>Observasi</td>
                        <td>Jurnal Sikap</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;">3</td>
                        <td>Pengetahuan</td>
                        <td>Tes Tertulis</td>
                        <td>Pilihan Ganda, Uraian</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;">4</td>
                        <td>Keterampilan</td>
                        <td>Praktik/Unjuk Kerja</td>
                        <td>Rubrik Penilaian</td>
                    </tr>
                </tbody>
            </table>
            ${modul.asesmen ? `<p style="margin-top: 10px;"><strong>Catatan Asesmen:</strong> ${modul.asesmen}</p>` : ''}
            
            <h2>H. SUMBER BELAJAR</h2>
            <ol>
                <li>Al-Qur'an dan Terjemahannya</li>
                <li>Buku Paket PAI dan Budi Pekerti Kelas ${info.kelas}</li>
                <li>Buku referensi yang relevan</li>
                <li>Media pembelajaran (gambar, video, audio)</li>
                <li>Lingkungan sekitar</li>
            </ol>
            
            ${generateSignature(info)}
        </div>
    `;
}

// ===== DOWNLOAD DOCUMENT =====
function downloadDoc(type) {
    // First preview the document
    previewDoc(type);
    
    // Then trigger print
    setTimeout(() => {
        window.print();
    }, 500);
}

function downloadAllDocs() {
    showToast('Untuk download semua dokumen, silakan preview dan print satu per satu', 'info');
}

// ===== UTILITY STATS =====
async function updateStats() {
    try {
        // Update siswa count
        document.getElementById('statSiswa').textContent = siswaData.length;
        
        // Update kelas count
        const kelasSet = new Set(siswaData.map(s => s.kelas).filter(k => k));
        document.getElementById('statKelas').textContent = kelasSet.size;
        
        // Update bank soal count
        const soalSnapshot = await db.collection('users').doc(currentUser.uid)
            .collection('banksoal').get();
        document.getElementById('statSoal').textContent = soalSnapshot.size;
        
        // Update modul count
        const modulSnapshot = await db.collection('users').doc(currentUser.uid)
            .collection('dokumen').get();
        document.getElementById('statModul').textContent = modulSnapshot.size;
        
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// ===== CONSOLE LOG =====
console.log('==========================================');
console.log('✅ ADMIN PAI SUPER APP');
console.log('📚 Version: 1.0.0');
console.log('👨‍🏫 For PAI Teachers');
console.log('🕌 Single Input - Multi Output');
console.log('==========================================');