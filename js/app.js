// ==========================================
// MAIN APPLICATION LOGIC
// ==========================================

// Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
}

// User Menu Toggle
function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    menu.classList.toggle('hidden');
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const userMenu = document.getElementById('userMenu');
    if (!e.target.closest('#userMenu') && !e.target.closest('[onclick="toggleUserMenu()"]')) {
        userMenu?.classList.add('hidden');
    }
});

// Logout
async function logout() {
    try {
        await auth.signOut();
        window.location.href = 'auth.html';
    } catch (error) {
        showToast('Error', 'Gagal logout', 'error');
    }
}

// Load Page Content
async function loadPage(page) {
    // Update active state
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) {
            item.classList.add('active');
        }
    });

    // Close mobile sidebar
    if (window.innerWidth < 1024) {
        toggleSidebar();
    }

    // Check premium access for premium features
    const premiumPages = ['promes', 'modul-ajar', 'jurnal', 'nilai', 'bank-soal'];
    if (premiumPages.includes(page) && !isPremiumUser()) {
        showUpgradeModal();
        return;
    }

    // Check admin access
    if (page === 'admin' && !isSuperAdmin()) {
        showToast('Akses Ditolak', 'Anda bukan Super Admin', 'error');
        return;
    }

    // Load page content
    const content = getPageContent(page);
    document.getElementById('mainContent').innerHTML = content;

    // Initialize page
    initializePage(page);
}

// Show Upgrade Modal
function showUpgradeModal() {
    const modal = `
        <div class="p-8 text-center">
            <div class="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <i class="fas fa-crown text-yellow-500 text-4xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">Fitur Premium</h3>
            <p class="text-gray-600 mb-6">Upgrade ke Premium untuk mengakses fitur ini dan nikmati semua kemudahan administrasi guru.</p>
            <div class="bg-gray-50 rounded-xl p-4 mb-6">
                <p class="text-3xl font-bold text-primary-600">Rp 99.000<span class="text-sm text-gray-500 font-normal">/tahun</span></p>
            </div>
            <div class="flex gap-3">
                <button onclick="hideModal()" class="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50">
                    Nanti Saja
                </button>
                <button onclick="loadPage('upgrade')" class="flex-1 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700">
                    Upgrade Sekarang
                </button>
            </div>
        </div>
    `;
    showModal(modal);
}

// Initialize Page
function initializePage(page) {
    switch (page) {
        case 'dashboard':
            initDashboard();
            break;
        case 'profil':
            initProfil();
            break;
        case 'kalender':
            initKalender();
            break;
        case 'jadwal':
            initJadwal();
            break;
        case 'siswa':
            initSiswa();
            break;
        case 'atp':
            initATP();
            break;
        case 'prota':
            initProta();
            break;
        case 'promes':
            initPromes();
            break;
        case 'modul-ajar':
            initModulAjar();
            break;
        case 'jurnal':
            initJurnal();
            break;
        case 'nilai':
            initNilai();
            break;
        case 'bank-soal':
            initBankSoal();
            break;
        case 'admin':
            initAdmin();
            break;
        case 'panduan':
            initPanduan();
            break;
        case 'ai-assistant':
            initAIAssistant();
            break;
    }
}

// ==========================================
// PAGE CONTENT TEMPLATES
// ==========================================

function getPageContent(page) {
    const contents = {
        dashboard: getDashboardContent(),
        profil: getProfilContent(),
        kalender: getKalenderContent(),
        jadwal: getJadwalContent(),
        siswa: getSiswaContent(),
        atp: getATPContent(),
        prota: getProtaContent(),
        promes: getPromesContent(),
        'modul-ajar': getModulAjarContent(),
        jurnal: getJurnalContent(),
        nilai: getNilaiContent(),
        'bank-soal': getBankSoalContent(),
        admin: getAdminContent(),
        panduan: getPanduanContent(),
        'ai-assistant': getAIAssistantContent(),
        upgrade: getUpgradeContent()
    };
    return contents[page] || getDashboardContent();
}

// ==========================================
// DASHBOARD CONTENT
// ==========================================

function getDashboardContent() {
    return `
        <div class="p-4 lg:p-8">
            <!-- Header -->
            <div class="mb-8">
                <h1 class="text-2xl lg:text-3xl font-bold text-gray-800">Dashboard</h1>
                <p class="text-gray-500 mt-1">Selamat datang kembali, <span id="dashboardUserName">Guru</span>!</p>
            </div>

            <!-- Quick Stats -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover transition-all duration-300">
                    <div class="flex items-center justify-between mb-3">
                        <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <i class="fas fa-calendar-check text-blue-600 text-xl"></i>
                        </div>
                        <span class="text-xs text-gray-400">Semester 1</span>
                    </div>
                    <p id="statHariEfektif" class="text-2xl font-bold text-gray-800">0</p>
                    <p class="text-sm text-gray-500">Hari Efektif</p>
                </div>
                
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover transition-all duration-300">
                    <div class="flex items-center justify-between mb-3">
                        <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <i class="fas fa-users text-green-600 text-xl"></i>
                        </div>
                        <span class="text-xs text-gray-400">Aktif</span>
                    </div>
                    <p id="statSiswa" class="text-2xl font-bold text-gray-800">0</p>
                    <p class="text-sm text-gray-500">Total Siswa</p>
                </div>
                
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover transition-all duration-300">
                    <div class="flex items-center justify-between mb-3">
                        <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <i class="fas fa-book-open text-purple-600 text-xl"></i>
                        </div>
                        <span class="text-xs text-gray-400">Generated</span>
                    </div>
                    <p id="statTP" class="text-2xl font-bold text-gray-800">0</p>
                    <p class="text-sm text-gray-500">Tujuan Pembelajaran</p>
                </div>
                
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover transition-all duration-300">
                    <div class="flex items-center justify-between mb-3">
                        <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                            <i class="fas fa-chalkboard text-orange-600 text-xl"></i>
                        </div>
                        <span class="text-xs text-gray-400">Aktif</span>
                    </div>
                    <p id="statKelas" class="text-2xl font-bold text-gray-800">0</p>
                    <p class="text-sm text-gray-500">Kelas Diampu</p>
                </div>
            </div>

            <!-- Main Grid -->
            <div class="grid lg:grid-cols-3 gap-6">
                <!-- Quick Actions -->
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 class="text-lg font-bold text-gray-800 mb-4">Aksi Cepat</h2>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button onclick="loadPage('kalender')" class="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-center transition group">
                                <div class="w-12 h-12 mx-auto bg-blue-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition">
                                    <i class="fas fa-calendar-alt text-white text-xl"></i>
                                </div>
                                <p class="text-sm font-medium text-gray-700">Kalender</p>
                            </button>
                            <button onclick="loadPage('jadwal')" class="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-center transition group">
                                <div class="w-12 h-12 mx-auto bg-green-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition">
                                    <i class="fas fa-clock text-white text-xl"></i>
                                </div>
                                <p class="text-sm font-medium text-gray-700">Jadwal</p>
                            </button>
                            <button onclick="loadPage('atp')" class="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition group">
                                <div class="w-12 h-12 mx-auto bg-purple-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition">
                                    <i class="fas fa-sitemap text-white text-xl"></i>
                                </div>
                                <p class="text-sm font-medium text-gray-700">ATP</p>
                            </button>
                            <button onclick="loadPage('siswa')" class="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl text-center transition group">
                                <div class="w-12 h-12 mx-auto bg-orange-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition">
                                    <i class="fas fa-users text-white text-xl"></i>
                                </div>
                                <p class="text-sm font-medium text-gray-700">Siswa</p>
                            </button>
                        </div>
                    </div>

                    <!-- Workflow Guide -->
                    <div class="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 mt-6 text-white">
                        <h2 class="text-lg font-bold mb-4">🚀 Single Input - Multi Output</h2>
                        <div class="space-y-3">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">1</div>
                                <p class="text-sm">Input <strong>Kalender Pendidikan</strong> (hari efektif, libur)</p>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">2</div>
                                <p class="text-sm">Buat <strong>Jadwal Pelajaran</strong> dengan validasi anti-bentrok</p>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">3</div>
                                <p class="text-sm">Pilih <strong>Tujuan Pembelajaran</strong> dari CP PAI</p>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 bg-yellow-400 text-primary-800 rounded-full flex items-center justify-center font-bold">✓</div>
                                <p class="text-sm"><strong>Otomatis:</strong> ATP, Prota, Promes, Modul Ajar tersinkron!</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar Info -->
                <div class="space-y-6">
                    <!-- Subscription Info -->
                    <div id="subscriptionCard" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-lg font-bold text-gray-800">Status Langganan</h2>
                            <span id="subscriptionBadge" class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Free</span>
                        </div>
                        <div id="subscriptionContent">
                            <!-- Will be populated dynamically -->
                        </div>
                    </div>

                    <!-- Today's Schedule -->
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 class="text-lg font-bold text-gray-800 mb-4">Jadwal Hari Ini</h2>
                        <div id="todaySchedule" class="space-y-3">
                            <p class="text-gray-500 text-sm text-center py-4">Memuat jadwal...</p>
                        </div>
                    </div>

                    <!-- Quick Tips -->
                    <div class="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                        <h2 class="text-lg font-bold text-blue-800 mb-3">
                            <i class="fas fa-lightbulb text-yellow-500 mr-2"></i>Tips
                        </h2>
                        <p class="text-sm text-blue-700">
                            Gunakan menu <strong>AI Assistant</strong> untuk membuat konten pembelajaran 
                            dengan bantuan AI. Siapkan file CSV sesuai format yang diminta!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Initialize Dashboard
async function initDashboard() {
    if (userData) {
        document.getElementById('dashboardUserName').textContent = userData.name || 'Guru';
        
        // Load stats
        await loadDashboardStats();
        
        // Load subscription info
        loadSubscriptionInfo();
        
        // Load today's schedule
        loadTodaySchedule();
    }
}

async function loadDashboardStats() {
    try {
        // Get hari efektif from calendar
        const calendarSnap = await db.collection('calendars')
            .where('userId', '==', currentUser.uid)
            .limit(1)
            .get();
        
        if (!calendarSnap.empty) {
            const calendar = calendarSnap.docs[0].data();
            document.getElementById('statHariEfektif').textContent = calendar.totalEffectiveDays || 0;
        }

        // Get total students
        const studentsSnap = await db.collection('students')
            .where('userId', '==', currentUser.uid)
            .get();
        document.getElementById('statSiswa').textContent = studentsSnap.size;

        // Get total TP
        const atpSnap = await db.collection('atp')
            .where('userId', '==', currentUser.uid)
            .get();
        let totalTP = 0;
        atpSnap.forEach(doc => {
            const data = doc.data();
            totalTP += (data.tujuanPembelajaran || []).length;
        });
        document.getElementById('statTP').textContent = totalTP;

        // Get total classes
        const schedulesSnap = await db.collection('schedules')
            .where('userId', '==', currentUser.uid)
            .get();
        const classes = new Set();
        schedulesSnap.forEach(doc => {
            classes.add(doc.data().classId);
        });
        document.getElementById('statKelas').textContent = classes.size;

    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

function loadSubscriptionInfo() {
    const badge = document.getElementById('subscriptionBadge');
    const content = document.getElementById('subscriptionContent');
    
    if (isPremiumUser()) {
        badge.className = 'px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold';
        badge.textContent = 'Premium';
        
        let expiryText = 'Selamanya';
        if (userData.subscriptionExpiry) {
            const expiry = userData.subscriptionExpiry.toDate();
            expiryText = formatDate(expiry, 'short');
        }
        
        content.innerHTML = `
            <div class="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl">
                <i class="fas fa-crown text-yellow-500 text-2xl"></i>
                <div>
                    <p class="font-medium text-gray-800">Akses Penuh</p>
                    <p class="text-xs text-gray-500">Berlaku hingga: ${expiryText}</p>
                </div>
            </div>
        `;
    } else {
        badge.className = 'px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium';
        badge.textContent = 'Free';
        
        content.innerHTML = `
            <div class="space-y-3">
                <p class="text-sm text-gray-600">Upgrade ke Premium untuk akses:</p>
                <ul class="text-sm text-gray-500 space-y-1">
                    <li><i class="fas fa-check text-green-500 mr-2"></i>Promes lengkap</li>
                    <li><i class="fas fa-check text-green-500 mr-2"></i>Modul Ajar + LKPD</li>
                    <li><i class="fas fa-check text-green-500 mr-2"></i>Bank Soal unlimited</li>
                </ul>
                <button onclick="loadPage('upgrade')" class="w-full py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition">
                    <i class="fas fa-crown mr-2"></i>Upgrade Sekarang
                </button>
            </div>
        `;
    }
}

async function loadTodaySchedule() {
    const container = document.getElementById('todaySchedule');
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const today = days[new Date().getDay()];
    
    if (today === 'Minggu') {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-coffee text-3xl text-gray-300 mb-2"></i>
                <p class="text-gray-500 text-sm">Hari Minggu - Libur</p>
            </div>
        `;
        return;
    }

    try {
        const snapshot = await db.collection('schedules')
            .where('userId', '==', currentUser.uid)
            .where('day', '==', today)
            .orderBy('timeSlot')
            .get();

        if (snapshot.empty) {
            container.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-calendar-times text-3xl text-gray-300 mb-2"></i>
                    <p class="text-gray-500 text-sm">Tidak ada jadwal hari ini</p>
                </div>
            `;
            return;
        }

        let html = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            html += `
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <i class="fas fa-book text-primary-600"></i>
                    </div>
                    <div class="flex-1">
                        <p class="font-medium text-gray-800">${data.className || 'Kelas'}</p>
                        <p class="text-xs text-gray-500">${data.timeSlot || ''}</p>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading schedule:', error);
        container.innerHTML = '<p class="text-red-500 text-sm text-center">Gagal memuat jadwal</p>';
    }
}

// ==========================================
// PROFIL CONTENT
// ==========================================

function getProfilContent() {
    return `
        <div class="p-4 lg:p-8">
            <div class="mb-8">
                <h1 class="text-2xl lg:text-3xl font-bold text-gray-800">Profil Saya</h1>
                <p class="text-gray-500 mt-1">Kelola informasi profil dan satuan pendidikan</p>
            </div>

            <div class="grid lg:grid-cols-3 gap-6">
                <!-- Profile Card -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                        <div class="w-24 h-24 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-4">
                            <span id="profilInitial" class="text-4xl font-bold text-primary-600">U</span>
                        </div>
                        <h3 id="profilName" class="text-xl font-bold text-gray-800">Nama Pengguna</h3>
                        <p id="profilEmail" class="text-gray-500 text-sm">email@contoh.com</p>
                        <div id="profilBadge" class="mt-4">
                            <span class="px-4 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">Free Plan</span>
                        </div>
                    </div>
                </div>

                <!-- Profile Form -->
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 class="text-lg font-bold text-gray-800 mb-6">Informasi Pribadi</h2>
                        <form id="profilForm" class="space-y-5">
                            <div class="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                                    <input type="text" id="profilNama" required
                                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">NIP/NRG</label>
                                    <input type="text" id="profilNIP"
                                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition"
                                        placeholder="1234567890123456">
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">No. HP/WhatsApp</label>
                                <input type="tel" id="profilPhone"
                                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition"
                                    placeholder="08123456789">
                            </div>

                            <hr class="my-6">
                            
                            <h3 class="text-lg font-bold text-gray-800 mb-4">Satuan Pendidikan</h3>
                            
                            <div class="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Nama Sekolah</label>
                                    <input type="text" id="profilSchool" required
                                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition"
                                        placeholder="SDN 1 Contoh">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Jenjang</label>
                                    <select id="profilLevel"
                                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition">
                                        <option value="SD">SD/MI</option>
                                        <option value="SMP">SMP/MTs</option>
                                        <option value="SMA">SMA/MA</option>
                                        <option value="SMK">SMK</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Alamat Sekolah</label>
                                <textarea id="profilAddress" rows="2"
                                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition resize-none"
                                    placeholder="Jl. Contoh No. 123, Kota"></textarea>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Nama Kepala Sekolah</label>
                                <input type="text" id="profilPrincipal"
                                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition"
                                    placeholder="Nama Kepala Sekolah">
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">NIP Kepala Sekolah</label>
                                <input type="text" id="profilPrincipalNIP"
                                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition"
                                    placeholder="NIP Kepala Sekolah">
                            </div>

                            <div class="flex gap-3 pt-4">
                                <button type="submit" class="flex-1 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition">
                                    <i class="fas fa-save mr-2"></i>Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function initProfil() {
    if (!userData) return;

    // Set display info
    document.getElementById('profilInitial').textContent = (userData.name || 'U').charAt(0).toUpperCase();
    document.getElementById('profilName').textContent = userData.name || 'Nama Pengguna';
    document.getElementById('profilEmail').textContent = userData.email || '';

    // Set badge
    const badge = document.getElementById('profilBadge');
    if (isPremiumUser()) {
        badge.innerHTML = '<span class="px-4 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold"><i class="fas fa-crown mr-1"></i>Premium</span>';
    }

    // Fill form
    document.getElementById('profilNama').value = userData.name || '';
    document.getElementById('profilNIP').value = userData.profile?.nip || '';
    document.getElementById('profilPhone').value = userData.profile?.phone || '';
    document.getElementById('profilSchool').value = userData.profile?.school || '';
    document.getElementById('profilLevel').value = userData.profile?.level || 'SD';
    document.getElementById('profilAddress').value = userData.profile?.address || '';
    document.getElementById('profilPrincipal').value = userData.profile?.principalName || '';
    document.getElementById('profilPrincipalNIP').value = userData.profile?.principalNIP || '';

    // Form submit
    document.getElementById('profilForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoading('Menyimpan...');

        try {
            const updateData = {
                name: document.getElementById('profilNama').value,
                profile: {
                    nip: document.getElementById('profilNIP').value,
                    phone: document.getElementById('profilPhone').value,
                    school: document.getElementById('profilSchool').value,
                    level: document.getElementById('profilLevel').value,
                    address: document.getElementById('profilAddress').value,
                    principalName: document.getElementById('profilPrincipal').value,
                    principalNIP: document.getElementById('profilPrincipalNIP').value
                },
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await db.collection('users').doc(currentUser.uid).update(updateData);
            
            // Update local data
            userData = { ...userData, ...updateData };
            
            // Update display
            document.getElementById('userName').textContent = updateData.name;
            document.getElementById('userInitial').textContent = updateData.name.charAt(0).toUpperCase();
            document.getElementById('profilName').textContent = updateData.name;
            document.getElementById('profilInitial').textContent = updateData.name.charAt(0).toUpperCase();

            hideLoading();
            showToast('Berhasil!', 'Profil berhasil diperbarui', 'success');
        } catch (error) {
            hideLoading();
            console.error('Error updating profile:', error);
            showToast('Gagal!', 'Gagal memperbarui profil', 'error');
        }
    });
}

// ==========================================
// KALENDER CONTENT
// ==========================================

function getKalenderContent() {
    return `
        <div class="p-4 lg:p-8">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 class="text-2xl lg:text-3xl font-bold text-gray-800">Kalender Pendidikan</h1>
                    <p class="text-gray-500 mt-1">Kelola hari efektif, libur, dan pekan ujian</p>
                </div>
                <div class="flex gap-3">
                    <button onclick="showKalenderForm()" class="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition flex items-center gap-2">
                        <i class="fas fa-plus"></i>
                        <span>Tambah Semester</span>
                    </button>
                </div>
            </div>

            <!-- Semester Selection -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <div class="flex flex-col md:flex-row md:items-center gap-4">
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tahun Ajaran</label>
                        <select id="kalenderTahun" onchange="loadKalenderData()"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition">
                            <option value="2024/2025">2024/2025</option>
                            <option value="2025/2026">2025/2026</option>
                        </select>
                    </div>
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                        <select id="kalenderSemester" onchange="loadKalenderData()"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition">
                            <option value="1">Semester 1 (Ganjil)</option>
                            <option value="2">Semester 2 (Genap)</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Calendar Data Display -->
            <div id="kalenderDataContainer" class="grid lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="text-lg font-bold text-gray-800">Data Semester</h2>
                            <button onclick="editKalender()" id="editKalenderBtn" class="hidden px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition text-sm font-medium">
                                <i class="fas fa-edit mr-1"></i>Edit
                            </button>
                        </div>
                        <div id="kalenderDetail" class="text-center py-12 text-gray-400">
                            <i class="fas fa-calendar-plus text-5xl mb-4"></i>
                            <p>Belum ada data kalender</p>
                            <button onclick="showKalenderForm()" class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm">
                                Tambah Sekarang
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Summary -->
                <div class="space-y-6">
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 class="font-bold text-gray-800 mb-4">Ringkasan</h3>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                                <span class="text-sm text-gray-600">Hari Efektif</span>
                                <span id="summaryEfektif" class="font-bold text-blue-600">0 hari</span>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-red-50 rounded-xl">
                                <span class="text-sm text-gray-600">Hari Libur</span>
                                <span id="summaryLibur" class="font-bold text-red-600">0 hari</span>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                                <span class="text-sm text-gray-600">Pekan Efektif</span>
                                <span id="summaryPekan" class="font-bold text-purple-600">0 pekan</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-yellow-50 rounded-2xl p-6 border border-yellow-100">
                        <h3 class="font-bold text-yellow-800 mb-2">
                            <i class="fas fa-info-circle mr-2"></i>Info Penting
                        </h3>
                        <p class="text-sm text-yellow-700">
                            Data kalender akan otomatis digunakan untuk menghitung alokasi waktu di Prota dan Promes.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Holidays List -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-lg font-bold text-gray-800">Daftar Hari Libur & Kegiatan</h2>
                    <button onclick="showAddHolidayForm()" id="addHolidayBtn" class="hidden px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition text-sm font-medium">
                        <i class="fas fa-plus mr-1"></i>Tambah
                    </button>
                </div>
                <div id="holidaysList" class="text-center py-8 text-gray-400">
                    <p>Belum ada data hari libur</p>
                </div>
            </div>
        </div>
    `;
}

let currentKalenderId = null;

async function initKalender() {
    await loadKalenderData();
}

async function loadKalenderData() {
    const tahun = document.getElementById('kalenderTahun').value;
    const semester = document.getElementById('kalenderSemester').value;

    try {
        const snapshot = await db.collection('calendars')
            .where('userId', '==', currentUser.uid)
            .where('tahunAjaran', '==', tahun)
            .where('semester', '==', parseInt(semester))
            .limit(1)
            .get();

        if (snapshot.empty) {
            currentKalenderId = null;
            document.getElementById('kalenderDetail').innerHTML = `
                <div class="text-center py-12 text-gray-400">
                    <i class="fas fa-calendar-plus text-5xl mb-4"></i>
                    <p>Belum ada data kalender untuk semester ini</p>
                    <button onclick="showKalenderForm()" class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm">
                        Tambah Sekarang
                    </button>
                </div>
            `;
            document.getElementById('editKalenderBtn').classList.add('hidden');
            document.getElementById('addHolidayBtn').classList.add('hidden');
            document.getElementById('holidaysList').innerHTML = '<p class="text-gray-400">Belum ada data</p>';
            document.getElementById('summaryEfektif').textContent = '0 hari';
            document.getElementById('summaryLibur').textContent = '0 hari';
            document.getElementById('summaryPekan').textContent = '0 pekan';
            return;
        }

        const doc = snapshot.docs[0];
        const data = doc.data();
        currentKalenderId = doc.id;

        // Display calendar detail
        document.getElementById('kalenderDetail').innerHTML = `
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <h4 class="font-medium text-gray-500 text-sm mb-2">Tanggal Mulai</h4>
                    <p class="text-lg font-semibold text-gray-800">${formatDate(data.startDate.toDate())}</p>
                </div>
                <div>
                    <h4 class="font-medium text-gray-500 text-sm mb-2">Tanggal Selesai</h4>
                    <p class="text-lg font-semibold text-gray-800">${formatDate(data.endDate.toDate())}</p>
                </div>
                <div>
                    <h4 class="font-medium text-gray-500 text-sm mb-2">Total Hari Kalender</h4>
                    <p class="text-lg font-semibold text-gray-800">${data.totalDays || 0} hari</p>
                </div>
                <div>
                    <h4 class="font-medium text-gray-500 text-sm mb-2">Jam Pelajaran/Pekan</h4>
                    <p class="text-lg font-semibold text-gray-800">${data.jpPerWeek || 0} JP</p>
                </div>
            </div>
        `;

        // Show edit button
        document.getElementById('editKalenderBtn').classList.remove('hidden');
        document.getElementById('addHolidayBtn').classList.remove('hidden');

        // Update summary
        document.getElementById('summaryEfektif').textContent = `${data.effectiveDays || 0} hari`;
        document.getElementById('summaryLibur').textContent = `${(data.holidays || []).length} hari`;
        document.getElementById('summaryPekan').textContent = `${data.effectiveWeeks || 0} pekan`;

        // Display holidays
        displayHolidays(data.holidays || []);

    } catch (error) {
        console.error('Error loading calendar:', error);
        showToast('Error', 'Gagal memuat data kalender', 'error');
    }
}

function displayHolidays(holidays) {
    const container = document.getElementById('holidaysList');
    
    if (holidays.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-400 py-8">Belum ada data hari libur</p>';
        return;
    }

    // Sort by date
    holidays.sort((a, b) => new Date(a.date) - new Date(b.date));

    const typeColors = {
        'libur': 'bg-red-100 text-red-700',
        'ujian': 'bg-purple-100 text-purple-700',
        'kegiatan': 'bg-blue-100 text-blue-700'
    };

    let html = '<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">';
    holidays.forEach((h, index) => {
        const colorClass = typeColors[h.type] || 'bg-gray-100 text-gray-700';
        html += `
            <div class="flex items-center gap-3 p-4 border rounded-xl">
                <div class="w-12 h-12 ${colorClass} rounded-xl flex flex-col items-center justify-center">
                    <span class="text-xs font-bold">${new Date(h.date).getDate()}</span>
                    <span class="text-xs">${MONTHS[new Date(h.date).getMonth()].substring(0, 3)}</span>
                </div>
                <div class="flex-1">
                    <p class="font-medium text-gray-800 text-sm">${h.name}</p>
                    <p class="text-xs text-gray-500 capitalize">${h.type}</p>
                </div>
                <button onclick="deleteHoliday(${index})" class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <i class="fas fa-trash text-sm"></i>
                </button>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

function showKalenderForm(editData = null) {
    const tahun = document.getElementById('kalenderTahun').value;
    const semester = document.getElementById('kalenderSemester').value;
    
    const title = editData ? 'Edit Kalender' : 'Tambah Kalender Semester';
    
    const modal = `
        <div class="p-6">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-gray-800">${title}</h3>
                <button onclick="hideModal()" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <form id="kalenderForm" class="space-y-5">
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tahun Ajaran</label>
                        <input type="text" value="${tahun}" readonly
                            class="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                        <input type="text" value="Semester ${semester}" readonly
                            class="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500">
                    </div>
                </div>
                
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
                        <input type="date" id="kalStartDate" required
                            value="${editData ? formatDate(editData.startDate.toDate(), 'input') : ''}"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Selesai</label>
                        <input type="date" id="kalEndDate" required
                            value="${editData ? formatDate(editData.endDate.toDate(), 'input') : ''}"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition">
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Jumlah JP PAI per Minggu</label>
                    <input type="number" id="kalJpPerWeek" required min="1" max="10"
                        value="${editData?.jpPerWeek || 4}"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition"
                        placeholder="Contoh: 4">
                    <p class="text-xs text-gray-500 mt-1">Sesuaikan dengan struktur kurikulum</p>
                </div>

                <div class="flex gap-3 pt-4">
                    <button type="button" onclick="hideModal()" class="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition">
                        Batal
                    </button>
                    <button type="submit" class="flex-1 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition">
                        <i class="fas fa-save mr-2"></i>Simpan
                    </button>
                </div>
            </form>
        </div>
    `;
    
    showModal(modal);

    document.getElementById('kalenderForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveKalender();
    });
}

async function saveKalender() {
    const tahun = document.getElementById('kalenderTahun').value;
    const semester = parseInt(document.getElementById('kalenderSemester').value);
    const startDate = new Date(document.getElementById('kalStartDate').value);
    const endDate = new Date(document.getElementById('kalEndDate').value);
    const jpPerWeek = parseInt(document.getElementById('kalJpPerWeek').value);

    if (endDate <= startDate) {
        showToast('Error', 'Tanggal selesai harus setelah tanggal mulai', 'error');
        return;
    }

    showLoading('Menyimpan...');

    try {
        // Calculate days
        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        
        // Calculate effective days (exclude Sundays)
        let effectiveDays = 0;
        let effectiveWeeks = 0;
        let current = new Date(startDate);
        let weekCount = 0;
        
        while (current <= endDate) {
            if (current.getDay() !== 0) { // Not Sunday
                effectiveDays++;
            }
            if (current.getDay() === 1) { // Monday
                weekCount++;
            }
            current.setDate(current.getDate() + 1);
        }
        effectiveWeeks = weekCount;

        const calendarData = {
            userId: currentUser.uid,
            tahunAjaran: tahun,
            semester: semester,
            startDate: firebase.firestore.Timestamp.fromDate(startDate),
            endDate: firebase.firestore.Timestamp.fromDate(endDate),
            totalDays: totalDays,
            effectiveDays: effectiveDays,
            effectiveWeeks: effectiveWeeks,
            jpPerWeek: jpPerWeek,
            holidays: [],
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (currentKalenderId) {
            // Update existing
            const existingDoc = await db.collection('calendars').doc(currentKalenderId).get();
            calendarData.holidays = existingDoc.data().holidays || [];
            await db.collection('calendars').doc(currentKalenderId).update(calendarData);
        } else {
            // Create new
            calendarData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('calendars').add(calendarData);
        }

        hideModal();
        hideLoading();
        showToast('Berhasil!', 'Data kalender berhasil disimpan', 'success');
        await loadKalenderData();
    } catch (error) {
        hideLoading();
        console.error('Error saving calendar:', error);
        showToast('Gagal!', 'Gagal menyimpan data kalender', 'error');
    }
}

async function editKalender() {
    if (!currentKalenderId) return;
    
    try {
        const doc = await db.collection('calendars').doc(currentKalenderId).get();
        showKalenderForm(doc.data());
    } catch (error) {
        showToast('Error', 'Gagal memuat data', 'error');
    }
}

function showAddHolidayForm() {
    const modal = `
        <div class="p-6">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-gray-800">Tambah Hari Libur/Kegiatan</h3>
                <button onclick="hideModal()" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <form id="holidayForm" class="space-y-5">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                    <input type="date" id="holidayDate" required
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nama Kegiatan/Libur</label>
                    <input type="text" id="holidayName" required
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition"
                        placeholder="Contoh: Libur Hari Raya">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Tipe</label>
                    <select id="holidayType"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition">
                        <option value="libur">Hari Libur</option>
                        <option value="ujian">Pekan Ujian</option>
                        <option value="kegiatan">Kegiatan Sekolah</option>
                    </select>
                </div>

                <div class="flex gap-3 pt-4">
                    <button type="button" onclick="hideModal()" class="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition">
                        Batal
                    </button>
                    <button type="submit" class="flex-1 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition">
                        <i class="fas fa-plus mr-2"></i>Tambah
                    </button>
                </div>
            </form>
        </div>
    `;
    
    showModal(modal);

    document.getElementById('holidayForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await addHoliday();
    });
}

async function addHoliday() {
    if (!currentKalenderId) return;

    const date = document.getElementById('holidayDate').value;
    const name = document.getElementById('holidayName').value;
    const type = document.getElementById('holidayType').value;

    showLoading('Menyimpan...');

    try {
        await db.collection('calendars').doc(currentKalenderId).update({
            holidays: firebase.firestore.FieldValue.arrayUnion({
                date: date,
                name: name,
                type: type
            }),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        hideModal();
        hideLoading();
        showToast('Berhasil!', 'Hari libur berhasil ditambahkan', 'success');
        await loadKalenderData();
    } catch (error) {
        hideLoading();
        console.error('Error adding holiday:', error);
        showToast('Gagal!', 'Gagal menambahkan hari libur', 'error');
    }
}

async function deleteHoliday(index) {
    if (!currentKalenderId) return;
    if (!confirm('Hapus hari libur ini?')) return;

    showLoading('Menghapus...');

    try {
        const doc = await db.collection('calendars').doc(currentKalenderId).get();
        const holidays = doc.data().holidays || [];
        holidays.splice(index, 1);

        await db.collection('calendars').doc(currentKalenderId).update({
            holidays: holidays,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        hideLoading();
        showToast('Berhasil!', 'Hari libur berhasil dihapus', 'success');
        await loadKalenderData();
    } catch (error) {
        hideLoading();
        showToast('Gagal!', 'Gagal menghapus hari libur', 'error');
    }
}

// ==========================================
// JADWAL PELAJARAN CONTENT
// ==========================================

function getJadwalContent() {
    return `
        <div class="p-4 lg:p-8">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 class="text-2xl lg:text-3xl font-bold text-gray-800">Jadwal Pelajaran</h1>
                    <p class="text-gray-500 mt-1">Kelola jadwal mengajar dengan validasi anti-bentrok</p>
                </div>
                <div class="flex gap-3">
                    <button onclick="showTimeSlotSettings()" class="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
                        <i class="fas fa-cog mr-2"></i>Jam Pelajaran
                    </button>
                    <button onclick="showAddJadwalForm()" class="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition">
                        <i class="fas fa-plus mr-2"></i>Tambah Jadwal
                    </button>
                </div>
            </div>

            <!-- Filter -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <div class="grid md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tahun Ajaran</label>
                        <select id="jadwalTahun" onchange="loadJadwalData()"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition">
                            <option value="2024/2025">2024/2025</option>
                            <option value="2025/2026">2025/2026</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                        <select id="jadwalSemester" onchange="loadJadwalData()"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition">
                            <option value="1">Semester 1</option>
                            <option value="2">Semester 2</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Kelas</label>
                        <select id="jadwalKelas" onchange="filterJadwal()"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition">
                            <option value="all">Semua Kelas</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Schedule Table -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Jam</th>
                                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Senin</th>
                                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Selasa</th>
                                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rabu</th>
                                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Kamis</th>
                                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Jumat</th>
                                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Sabtu</th>
                            </tr>
                        </thead>
                        <tbody id="jadwalTableBody">
                            <tr>
                                <td colspan="7" class="px-6 py-12 text-center text-gray-400">
                                    <i class="fas fa-calendar-times text-4xl mb-3"></i>
                                    <p>Belum ada jadwal. Klik "Tambah Jadwal" untuk memulai.</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Legend -->
            <div class="mt-6 flex flex-wrap gap-4">
                <div class="flex items-center gap-2">
                    <div class="w-4 h-4 bg-primary-100 rounded"></div>
                    <span class="text-sm text-gray-600">PAI & Budi Pekerti</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-4 h-4 bg-red-100 rounded"></div>
                    <span class="text-sm text-gray-600">Konflik Jadwal</span>
                </div>
            </div>
        </div>
    `;
}

let timeSlots = [];
let jadwalData = [];

async function initJadwal() {
    await loadTimeSlots();
    await loadJadwalData();
}

async function loadTimeSlots() {
    try {
        const doc = await db.collection('settings').doc(currentUser.uid).get();
        if (doc.exists && doc.data().timeSlots) {
            timeSlots = doc.data().timeSlots;
        } else {
            // Default time slots
            timeSlots = [
                { id: 1, start: '07:00', end: '07:35' },
                { id: 2, start: '07:35', end: '08:10' },
                { id: 3, start: '08:10', end: '08:45' },
                { id: 4, start: '08:45', end: '09:20' },
                { id: 5, start: '09:35', end: '10:10' },
                { id: 6, start: '10:10', end: '10:45' },
                { id: 7, start: '10:45', end: '11:20' },
                { id: 8, start: '11:20', end: '11:55' }
            ];
        }
    } catch (error) {
        console.error('Error loading time slots:', error);
    }
}

async function loadJadwalData() {
    const tahun = document.getElementById('jadwalTahun').value;
    const semester = document.getElementById('jadwalSemester').value;

    try {
        const snapshot = await db.collection('schedules')
            .where('userId', '==', currentUser.uid)
            .where('tahunAjaran', '==', tahun)
            .where('semester', '==', parseInt(semester))
            .get();

        jadwalData = [];
        const classes = new Set();

        snapshot.forEach(doc => {
            const data = { id: doc.id, ...doc.data() };
            jadwalData.push(data);
            classes.add(data.className);
        });

        // Update class filter
        const kelasSelect = document.getElementById('jadwalKelas');
        kelasSelect.innerHTML = '<option value="all">Semua Kelas</option>';
        Array.from(classes).sort().forEach(kelas => {
            kelasSelect.innerHTML += `<option value="${kelas}">${kelas}</option>`;
        });

        renderJadwalTable();
    } catch (error) {
        console.error('Error loading jadwal:', error);
        showToast('Error', 'Gagal memuat jadwal', 'error');
    }
}

function renderJadwalTable() {
    const tbody = document.getElementById('jadwalTableBody');
    const filterKelas = document.getElementById('jadwalKelas').value;
    
    let filteredData = jadwalData;
    if (filterKelas !== 'all') {
        filteredData = jadwalData.filter(j => j.className === filterKelas);
    }

    if (timeSlots.length === 0 || filteredData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-12 text-center text-gray-400">
                    <i class="fas fa-calendar-times text-4xl mb-3"></i>
                    <p>Belum ada jadwal. Klik "Tambah Jadwal" untuk memulai.</p>
                </td>
            </tr>
        `;
        return;
    }

    let html = '';
    timeSlots.forEach(slot => {
        html += `<tr class="border-t border-gray-100">`;
        html += `<td class="px-6 py-4 text-sm font-medium text-gray-700">${slot.start} - ${slot.end}</td>`;
        
        DAYS.forEach(day => {
            const schedules = filteredData.filter(j => j.day === day && j.timeSlotId === slot.id);
            
            if (schedules.length > 1) {
                // Conflict!
                html += `
                    <td class="px-2 py-2">
                        <div class="bg-red-100 border border-red-300 rounded-lg p-2 text-center">
                            <i class="fas fa-exclamation-triangle text-red-500"></i>
                            <p class="text-xs text-red-600 font-medium">Bentrok!</p>
                        </div>
                    </td>
                `;
            } else if (schedules.length === 1) {
                const s = schedules[0];
                html += `
                    <td class="px-2 py-2">
                        <div class="bg-primary-50 border border-primary-200 rounded-lg p-2 cursor-pointer hover:bg-primary-100 transition"
                             onclick="showJadwalDetail('${s.id}')">
                            <p class="font-medium text-sm text-primary-700">${s.className}</p>
                            <p class="text-xs text-gray-500">${s.subject || 'PAI'}</p>
                        </div>
                    </td>
                `;
            } else {
                html += `<td class="px-2 py-2"><div class="h-12"></div></td>`;
            }
        });
        
        html += `</tr>`;
    });

    tbody.innerHTML = html;
}

function filterJadwal() {
    renderJadwalTable();
}

function showTimeSlotSettings() {
    let slotsHtml = '';
    timeSlots.forEach((slot, index) => {
        slotsHtml += `
            <div class="flex items-center gap-3 mb-3">
                <span class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium">${index + 1}</span>
                <input type="time" value="${slot.start}" onchange="updateTimeSlot(${index}, 'start', this.value)"
                    class="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <span class="text-gray-400">-</span>
                <input type="time" value="${slot.end}" onchange="updateTimeSlot(${index}, 'end', this.value)"
                    class="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <button onclick="removeTimeSlot(${index})" class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <i class="fas fa-trash text-sm"></i>
                </button>
            </div>
        `;
    });

    const modal = `
        <div class="p-6">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-gray-800">Pengaturan Jam Pelajaran</h3>
                <button onclick="hideModal()" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="mb-4">
                <p class="text-sm text-gray-500 mb-4">Atur jam pelajaran sesuai jadwal sekolah Anda</p>
                <div id="timeSlotsContainer">
                    ${slotsHtml}
                </div>
                <button onclick="addTimeSlot()" class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary-500 hover:text-primary-600 transition mt-2">
                    <i class="fas fa-plus mr-2"></i>Tambah Jam
                </button>
            </div>

            <div class="flex gap-3 pt-4">
                <button type="button" onclick="hideModal()" class="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition">
                    Batal
                </button>
                <button onclick="saveTimeSlots()" class="flex-1 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition">
                    <i class="fas fa-save mr-2"></i>Simpan
                </button>
            </div>
        </div>
    `;
    
    showModal(modal);
}

function updateTimeSlot(index, field, value) {
    timeSlots[index][field] = value;
}

function addTimeSlot() {
    const lastSlot = timeSlots[timeSlots.length - 1];
    timeSlots.push({
        id: timeSlots.length + 1,
        start: lastSlot ? lastSlot.end : '07:00',
        end: '07:35'
    });
    showTimeSlotSettings(); // Refresh modal
}

function removeTimeSlot(index) {
    timeSlots.splice(index, 1);
    // Re-index
    timeSlots.forEach((slot, i) => slot.id = i + 1);
    showTimeSlotSettings(); // Refresh modal
}

async function saveTimeSlots() {
    showLoading('Menyimpan...');
    
    try {
        await db.collection('settings').doc(currentUser.uid).set({
            timeSlots: timeSlots,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        hideModal();
        hideLoading();
        showToast('Berhasil!', 'Jam pelajaran berhasil disimpan', 'success');
        renderJadwalTable();
    } catch (error) {
        hideLoading();
        showToast('Gagal!', 'Gagal menyimpan jam pelajaran', 'error');
    }
}

function showAddJadwalForm() {
    const tahun = document.getElementById('jadwalTahun').value;
    const semester = document.getElementById('jadwalSemester').value;
    
    let timeSlotsOptions = timeSlots.map(slot => 
        `<option value="${slot.id}">${slot.start} - ${slot.end}</option>`
    ).join('');

    const modal = `
        <div class="p-6">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-gray-800">Tambah Jadwal</h3>
                <button onclick="hideModal()" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <form id="jadwalForm" class="space-y-5">
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Hari</label>
                        <select id="jadwalDay" required
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition">
                            ${DAYS.map(d => `<option value="${d}">${d}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Jam Ke</label>
                        <select id="jadwalTimeSlot" required
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition">
                            ${timeSlotsOptions}
                        </select>
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Kelas</label>
                        <input type="text" id="jadwalClass" required
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition"
                            placeholder="Contoh: 7A, 8B">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Mata Pelajaran</label>
                        <input type="text" id="jadwalSubject" value="PAI & Budi Pekerti"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition">
                    </div>
                </div>

                <div id="conflictWarning" class="hidden p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p class="text-red-600 text-sm"><i class="fas fa-exclamation-triangle mr-2"></i>Jadwal bentrok!</p>
                </div>

                <div class="flex gap-3 pt-4">
                    <button type="button" onclick="hideModal()" class="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition">
                        Batal
                    </button>
                    <button type="submit" class="flex-1 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition">
                        <i class="fas fa-plus mr-2"></i>Tambah
                    </button>
                </div>
            </form>
        </div>
    `;
    
    showModal(modal);

    // Conflict check on input change
    ['jadwalDay', 'jadwalTimeSlot', 'jadwalClass'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', checkJadwalConflict);
    });

    document.getElementById('jadwalForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveJadwal();
    });
}

function checkJadwalConflict() {
    const day = document.getElementById('jadwalDay').value;
    const timeSlotId = parseInt(document.getElementById('jadwalTimeSlot').value);
    const className = document.getElementById('jadwalClass').value;
    const warning = document.getElementById('conflictWarning');

    const conflict = jadwalData.some(j => 
        j.day === day && 
        j.timeSlotId === timeSlotId && 
        (j.className === className || j.subject === 'PAI & Budi Pekerti')
    );

    if (conflict) {
        warning.classList.remove('hidden');
    } else {
        warning.classList.add('hidden');
    }
}

async function saveJadwal() {
    const tahun = document.getElementById('jadwalTahun').value;
    const semester = parseInt(document.getElementById('jadwalSemester').value);
    const day = document.getElementById('jadwalDay').value;
    const timeSlotId = parseInt(document.getElementById('jadwalTimeSlot').value);
    const className = document.getElementById('jadwalClass').value;
    const subject = document.getElementById('jadwalSubject').value;

    // Get time slot details
    const slot = timeSlots.find(s => s.id === timeSlotId);

    showLoading('Menyimpan...');

    try {
        await db.collection('schedules').add({
            userId: currentUser.uid,
            tahunAjaran: tahun,
            semester: semester,
            day: day,
            timeSlotId: timeSlotId,
            timeSlot: `${slot.start} - ${slot.end}`,
            className: className,
            subject: subject,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        hideModal();
        hideLoading();
        showToast('Berhasil!', 'Jadwal berhasil ditambahkan', 'success');
        await loadJadwalData();
    } catch (error) {
        hideLoading();
        console.error('Error saving jadwal:', error);
        showToast('Gagal!', 'Gagal menyimpan jadwal', 'error');
    }
}

function showJadwalDetail(id) {
    const jadwal = jadwalData.find(j => j.id === id);
    if (!jadwal) return;

    const modal = `
        <div class="p-6">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-gray-800">Detail Jadwal</h3>
                <button onclick="hideModal()" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="space-y-4 mb-6">
                <div class="flex justify-between p-3 bg-gray-50 rounded-xl">
                    <span class="text-gray-500">Hari</span>
                    <span class="font-medium text-gray-800">${jadwal.day}</span>
                </div>
                <div class="flex justify-between p-3 bg-gray-50 rounded-xl">
                    <span class="text-gray-500">Jam</span>
                    <span class="font-medium text-gray-800">${jadwal.timeSlot}</span>
                </div>
                <div class="flex justify-between p-3 bg-gray-50 rounded-xl">
                    <span class="text-gray-500">Kelas</span>
                    <span class="font-medium text-gray-800">${jadwal.className}</span>
                </div>
                <div class="flex justify-between p-3 bg-gray-50 rounded-xl">
                    <span class="text-gray-500">Mata Pelajaran</span>
                    <span class="font-medium text-gray-800">${jadwal.subject}</span>
                </div>
            </div>

            <div class="flex gap-3">
                <button onclick="deleteJadwal('${id}')" class="flex-1 py-3 bg-red-100 text-red-600 rounded-xl font-medium hover:bg-red-200 transition">
                    <i class="fas fa-trash mr-2"></i>Hapus
                </button>
                <button onclick="hideModal()" class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition">
                    Tutup
                </button>
            </div>
        </div>
    `;
    
    showModal(modal);
}

async function deleteJadwal(id) {
    if (!confirm('Hapus jadwal ini?')) return;

    showLoading('Menghapus...');

    try {
        await db.collection('schedules').doc(id).delete();
        hideModal();
        hideLoading();
        showToast('Berhasil!', 'Jadwal berhasil dihapus', 'success');
        await loadJadwalData();
    } catch (error) {
        hideLoading();
        showToast('Gagal!', 'Gagal menghapus jadwal', 'error');
    }
}

// ==========================================
// DATA SISWA CONTENT
// ==========================================

function getSiswaContent() {
    return `
        <div class="p-4 lg:p-8">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 class="text-2xl lg:text-3xl font-bold text-gray-800">Data Siswa</h1>
                    <p class="text-gray-500 mt-1">Kelola data siswa dengan import massal via CSV</p>
                </div>
                <div class="flex gap-3">
                    <button onclick="showImportSiswaForm()" class="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
                        <i class="fas fa-file-import mr-2"></i>Import CSV
                    </button>
                    <button onclick="showAddSiswaForm()" class="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition">
                        <i class="fas fa-plus mr-2"></i>Tambah Siswa
                    </button>
                </div>
            </div>

            <!-- Filter & Search -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <div class="grid md:grid-cols-4 gap-4">
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Cari Siswa</label>
                        <div class="relative">
                            <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input type="text" id="searchSiswa" placeholder="Nama atau NISN..."
                                onkeyup="filterSiswa()"
                                class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Kelas</label>
                        <select id="filterKelas" onchange="filterSiswa()"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition">
                            <option value="all">Semua Kelas</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Rombel</label>
                        <select id="filterRombel" onchange="filterSiswa()"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition">
                            <option value="all">Semua Rombel</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-white rounded-xl p-4 border border-gray-100">
                    <p class="text-2xl font-bold text-gray-800" id="totalSiswa">0</p>
                    <p class="text-sm text-gray-500">Total Siswa</p>
                </div>
                <div class="bg-white rounded-xl p-4 border border-gray-100">
                    <p class="text-2xl font-bold text-blue-600" id="totalLaki">0</p>
                    <p class="text-sm text-gray-500">Laki-laki</p>
                </div>
                <div class="bg-white rounded-xl p-4 border border-gray-100">
                    <p class="text-2xl font-bold text-pink-600" id="totalPerempuan">0</p>
                    <p class="text-sm text-gray-500">Perempuan</p>
                </div>
                <div class="bg-white rounded-xl p-4 border border-gray-100">
                    <p class="text-2xl font-bold text-green-600" id="totalKelas">0</p>
                    <p class="text-sm text-gray-500">Kelas</p>
                </div>
            </div>

            <!-- Student Table -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">No</th>
                                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">NISN</th>
                                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nama Siswa</th>
                                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">L/P</th>
                                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Kelas</th>
                                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rombel</th>
                                <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="siswaTableBody">
                            <tr>
                                <td colspan="7" class="px-6 py-12 text-center text-gray-400">
                                    <i class="fas fa-users text-4xl mb-3"></i>
                                    <p>Belum ada data siswa</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

let siswaData = [];

async function initSiswa() {
    await loadSiswaData();
}

async function loadSiswaData() {
    try {
        const snapshot = await db.collection('students')
            .where('userId', '==', currentUser.uid)
            .orderBy('nama')
            .get();

        siswaData = [];
        const kelasSet = new Set();
        const rombelSet = new Set();
        let laki = 0, perempuan = 0;

        snapshot.forEach(doc => {
            const data = { id: doc.id, ...doc.data() };
            siswaData.push(data);
            kelasSet.add(data.kelas);
            rombelSet.add(data.rombel);
            if (data.jenisKelamin === 'L') laki++;
            else perempuan++;
        });

        // Update stats
        document.getElementById('totalSiswa').textContent = siswaData.length;
        document.getElementById('totalLaki').textContent = laki;
        document.getElementById('totalPerempuan').textContent = perempuan;
        document.getElementById('totalKelas').textContent = kelasSet.size;

        // Update filters
        const filterKelas = document.getElementById('filterKelas');
        filterKelas.innerHTML = '<option value="all">Semua Kelas</option>';
        Array.from(kelasSet).sort().forEach(k => {
            filterKelas.innerHTML += `<option value="${k}">${k}</option>`;
        });

        const filterRombel = document.getElementById('filterRombel');
        filterRombel.innerHTML = '<option value="all">Semua Rombel</option>';
        Array.from(rombelSet).sort().forEach(r => {
            filterRombel.innerHTML += `<option value="${r}">${r}</option>`;
        });

        renderSiswaTable();
    } catch (error) {
        console.error('Error loading siswa:', error);
        showToast('Error', 'Gagal memuat data siswa', 'error');
    }
}

function filterSiswa() {
    renderSiswaTable();
}

function renderSiswaTable() {
    const tbody = document.getElementById('siswaTableBody');
    const search = document.getElementById('searchSiswa').value.toLowerCase();
    const kelas = document.getElementById('filterKelas').value;
    const rombel = document.getElementById('filterRombel').value;

    let filtered = siswaData.filter(s => {
        const matchSearch = s.nama.toLowerCase().includes(search) || s.nisn.includes(search);
        const matchKelas = kelas === 'all' || s.kelas === kelas;
        const matchRombel = rombel === 'all' || s.rombel === rombel;
        return matchSearch && matchKelas && matchRombel;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-12 text-center text-gray-400">
                    <i class="fas fa-search text-4xl mb-3"></i>
                    <p>Tidak ada data yang cocok</p>
                </td>
            </tr>
        `;
        return;
    }

    let html = '';
    filtered.forEach((s, index) => {
        const genderBadge = s.jenisKelamin === 'L' 
            ? '<span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">L</span>'
            : '<span class="px-2 py-1 bg-pink-100 text-pink-700 rounded-lg text-xs font-medium">P</span>';
        
        html += `
            <tr class="border-t border-gray-100 hover:bg-gray-50">
                <td class="px-6 py-4 text-sm text-gray-500">${index + 1}</td>
                <td class="px-6 py-4 text-sm font-medium text-gray-800">${s.nisn}</td>
                <td class="px-6 py-4 text-sm text-gray-800">${s.nama}</td>
                <td class="px-6 py-4">${genderBadge}</td>
                <td class="px-6 py-4 text-sm text-gray-600">${s.kelas}</td>
                <td class="px-6 py-4 text-sm text-gray-600">${s.rombel}</td>
                <td class="px-6 py-4 text-center">
                    <button onclick="editSiswa('${s.id}')" class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg mr-1">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteSiswa('${s.id}')" class="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function showAddSiswaForm() {
    const modal = `
        <div class="p-6">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-gray-800">Tambah Siswa</h3>
                <button onclick="hideModal()" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <form id="siswaForm" class="space-y-5">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">NISN</label>
                    <input type="text" id="siswaNisn" required
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition"
                        placeholder="Nomor Induk Siswa Nasional">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                    <input type="text" id="siswaNama" required
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition"
                        placeholder="Nama lengkap siswa">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
                    <select id="siswaGender" required
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition">
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                    </select>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Kelas</label>
                        <input type="text" id="siswaKelas" required
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition"
                            placeholder="7, 8, 9">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Rombel</label>
                        <input type="text" id="siswaRombel" required
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition"
                            placeholder="A, B, C">
                    </div>
                </div>

                <div class="flex gap-3 pt-4">
                    <button type="button" onclick="hideModal()" class="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition">
                        Batal
                    </button>
                    <button type="submit" class="flex-1 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition">
                        <i class="fas fa-save mr-2"></i>Simpan
                    </button>
                </div>
            </form>
        </div>
    `;
    
    showModal(modal);

    document.getElementById('siswaForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveSiswa();
    });
}

async function saveSiswa() {
    const nisn = document.getElementById('siswaNisn').value;
    const nama = document.getElementById('siswaNama').value;
    const jenisKelamin = document.getElementById('siswaGender').value;
    const kelas = document.getElementById('siswaKelas').value;
    const rombel = document.getElementById('siswaRombel').value;

    showLoading('Menyimpan...');

    try {
        await db.collection('students').add({
            userId: currentUser.uid,
            nisn: nisn,
            nama: nama,
            jenisKelamin: jenisKelamin,
            kelas: kelas,
            rombel: rombel,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        hideModal();
        hideLoading();
        showToast('Berhasil!', 'Data siswa berhasil disimpan', 'success');
        await loadSiswaData();
    } catch (error) {
        hideLoading();
        console.error('Error saving siswa:', error);
        showToast('Gagal!', 'Gagal menyimpan data siswa', 'error');
    }
}

async function deleteSiswa(id) {
    if (!confirm('Hapus data siswa ini?')) return;

    showLoading('Menghapus...');

    try {
        await db.collection('students').doc(id).delete();
        hideLoading();
        showToast('Berhasil!', 'Data siswa berhasil dihapus', 'success');
        await loadSiswaData();
    } catch (error) {
        hideLoading();
        showToast('Gagal!', 'Gagal menghapus data siswa', 'error');
    }
}

function showImportSiswaForm() {
    const modal = `
        <div class="p-6">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-gray-800">Import Data Siswa</h3>
                <button onclick="hideModal()" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="space-y-5">
                <div class="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <h4 class="font-medium text-blue-800 mb-2"><i class="fas fa-info-circle mr-2"></i>Format CSV</h4>
                    <p class="text-sm text-blue-700 mb-2">File CSV harus memiliki header:</p>
                    <code class="text-xs bg-blue-100 px-2 py-1 rounded">nisn,nama,jenisKelamin,kelas,rombel</code>
                    <p class="text-xs text-blue-600 mt-2">jenisKelamin: L atau P</p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">URL Google Spreadsheet (Published CSV)</label>
                    <input type="url" id="csvUrl"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition"
                        placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv">
                    <p class="text-xs text-gray-500 mt-1">Publish Google Sheet as CSV dan paste URL di sini</p>
                </div>

                <div class="text-center text-gray-400 text-sm">atau</div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Upload File CSV</label>
                    <input type="file" id="csvFile" accept=".csv"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition">
                </div>

                <div class="flex gap-3 pt-4">
                    <button type="button" onclick="hideModal()" class="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition">
                        Batal
                    </button>
                    <button onclick="importSiswaCSV()" class="flex-1 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition">
                        <i class="fas fa-file-import mr-2"></i>Import
                    </button>
                </div>
            </div>
        </div>
    `;
    
    showModal(modal);
}

async function importSiswaCSV() {
    const csvUrl = document.getElementById('csvUrl').value;
    const csvFile = document.getElementById('csvFile').files[0];

    if (!csvUrl && !csvFile) {
        showToast('Error', 'Masukkan URL atau pilih file CSV', 'error');
        return;
    }

    showLoading('Mengimport data...');

    try {
        let data;
        
        if (csvUrl) {
            data = await fetchCSV(csvUrl);
        } else {
            const text = await csvFile.text();
            data = parseCSV(text);
        }

        if (data.length === 0) {
            hideLoading();
            showToast('Error', 'File CSV kosong atau format salah', 'error');
            return;
        }

        // Batch write
        const batch = db.batch();
        let count = 0;

        for (const row of data) {
            if (!row.nisn || !row.nama) continue;
            
            const ref = db.collection('students').doc();
            batch.set(ref, {
                userId: currentUser.uid,
                nisn: row.nisn.trim(),
                nama: row.nama.trim(),
                jenisKelamin: (row.jenisKelamin || 'L').toUpperCase().trim(),
                kelas: row.kelas?.trim() || '',
                rombel: row.rombel?.trim() || '',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            count++;

            // Firestore batch limit is 500
            if (count % 400 === 0) {
                await batch.commit();
            }
        }

        await batch.commit();

        hideModal();
        hideLoading();
        showToast('Berhasil!', `${count} data siswa berhasil diimport`, 'success');
        await loadSiswaData();
    } catch (error) {
        hideLoading();
        console.error('Error importing CSV:', error);
        showToast('Gagal!', 'Gagal import data. Periksa format CSV.', 'error');
    }
}

// ==========================================
// ATP CONTENT
// ==========================================

function getATPContent() {
    return `
        <div class="p-4 lg:p-8">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 class="text-2xl lg:text-3xl font-bold text-gray-800">Alur Tujuan Pembelajaran</h1>
                    <p class="text-gray-500 mt-1">Generate ATP otomatis dari Capaian Pembelajaran PAI</p>
                </div>
                <div class="flex gap-3">
                    <button onclick="exportATP()" class="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
                        <i class="fas fa-download mr-2"></i>Export
                    </button>
                    <button onclick="showGenerateATPForm()" class="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition">
                        <i class="fas fa-magic mr-2"></i>Generate ATP
                    </button>
                </div>
            </div>

            <!-- Filter -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <div class="grid md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tahun Ajaran</label>
                        <select id="atpTahun" onchange="loadATPData()"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition">
                            <option value="2024/2025">2024/2025</option>
                            <option value="2025/2026">2025/2026</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Fase</label>
                        <select id="atpFase" onchange="loadATPData()"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition">
                            <option value="">Pilih Fase</option>
                            <option value="A">Fase A (Kelas 1-2)</option>
                            <option value="B">Fase B (Kelas 3-4)</option>
                            <option value="C">Fase C (Kelas 5-6)</option>
                            <option value="D">Fase D (Kelas 7-9)</option>
                            <option value="E">Fase E (Kelas 10)</option>
                            <option value="F">Fase F (Kelas 11-12)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Kelas</label>
                        <select id="atpKelas" onchange="loadATPData()"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition">
                            <option value="">Pilih Kelas</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- ATP Content -->
            <div id="atpContainer">
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <div class="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-6">
                        <i class="fas fa-sitemap text-purple-500 text-3xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">Generate ATP</h3>
                    <p class="text-gray-500 mb-6">Pilih fase dan kelas, lalu klik "Generate ATP" untuk membuat Alur Tujuan Pembelajaran</p>
                    <button onclick="showGenerateATPForm()" class="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition">
                        <i class="fas fa-magic mr-2"></i>Generate Sekarang
                    </button>
                </div>
            </div>
        </div>
    `;
}

let atpData = [];

async function initATP() {
    // Set default fase based on user's school level
    const level = userData?.profile?.level || 'SD';
    const faseSelect = document.getElementById('atpFase');
    
    const defaultFase = {
        'SD': 'A',
        'SMP': 'D',
        'SMA': 'E',
        'SMK': 'E'
    };
    
    faseSelect.value = defaultFase[level] || '';
    updateKelasOptions();
    await loadATPData();
}

function updateKelasOptions() {
    const fase = document.getElementById('atpFase').value;
    const kelasSelect = document.getElementById('atpKelas');
    
    kelasSelect.innerHTML = '<option value="">Pilih Kelas</option>';
    
    const cp = getCPByPhase(fase);
    if (cp) {
        cp.kelas.forEach(k => {
            kelasSelect.innerHTML += `<option value="${k}">Kelas ${k}</option>`;
        });
    }
}

// Listen for fase change
document.addEventListener('change', (e) => {
    if (e.target.id === 'atpFase') {
        updateKelasOptions();
    }
});

async function loadATPData() {
    const tahun = document.getElementById('atpTahun')?.value;
    const fase = document.getElementById('atpFase')?.value;
    const kelas = document.getElementById('atpKelas')?.value;

    if (!fase) return;

    try {
        const snapshot = await db.collection('atp')
            .where('userId', '==', currentUser.uid)
            .where('tahunAjaran', '==', tahun)
            .where('fase', '==', fase)
            .where('kelas', '==', kelas)
            .get();

        if (snapshot.empty) {
            document.getElementById('atpContainer').innerHTML = `
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <div class="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-6">
                        <i class="fas fa-sitemap text-purple-500 text-3xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">Belum Ada ATP</h3>
                    <p class="text-gray-500 mb-6">ATP untuk Fase ${fase} Kelas ${kelas} belum dibuat</p>
                    <button onclick="showGenerateATPForm()" class="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition">
                        <i class="fas fa-magic mr-2"></i>Generate Sekarang
                    </button>
                </div>
            `;
            return;
        }

        // Display ATP
        const doc = snapshot.docs[0];
        const data = doc.data();
        atpData = data;

        renderATP(doc.id, data);
    } catch (error) {
        console.error('Error loading ATP:', error);
    }
}

function renderATP(docId, data) {
    const cp = getCPByPhase(data.fase);
    
    let elementsHtml = '';
    cp.capaian.forEach((c, idx) => {
        const tps = data.tujuanPembelajaran?.filter(tp => tp.elemen === c.elemen) || [];
        
        elementsHtml += `
            <div class="border rounded-xl overflow-hidden mb-4">
                <div class="bg-primary-50 px-6 py-4 flex items-center justify-between cursor-pointer" onclick="toggleATPElement(${idx})">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold">
                            ${idx + 1}
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-800">${c.elemen}</h4>
                            <p class="text-sm text-gray-500">${tps.length} Tujuan Pembelajaran</p>
                        </div>
                    </div>
                    <i class="fas fa-chevron-down text-gray-400 transition" id="atpIcon${idx}"></i>
                </div>
                <div class="p-6 hidden" id="atpContent${idx}">
                    <div class="mb-4 p-4 bg-gray-50 rounded-lg">
                        <h5 class="text-sm font-medium text-gray-500 mb-2">Capaian Pembelajaran:</h5>
                        <p class="text-gray-700">${c.deskripsi}</p>
                    </div>
                    <h5 class="text-sm font-medium text-gray-500 mb-3">Tujuan Pembelajaran:</h5>
                    <div class="space-y-2">
                        ${tps.map((tp, i) => `
                            <div class="flex items-start gap-3 p-3 bg-white border rounded-lg">
                                <span class="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                    ${i + 1}
                                </span>
                                <p class="text-gray-700 text-sm">${tp.tujuan}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    });

    document.getElementById('atpContainer').innerHTML = `
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-lg font-bold text-gray-800">ATP Fase ${data.fase} - Kelas ${data.kelas}</h2>
                    <p class="text-sm text-gray-500">Tahun Ajaran ${data.tahunAjaran}</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="editATP('${docId}')" class="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg text-sm font-medium">
                        <i class="fas fa-edit mr-1"></i>Edit
                    </button>
                    <button onclick="deleteATP('${docId}')" class="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium">
                        <i class="fas fa-trash mr-1"></i>Hapus
                    </button>
                </div>
            </div>
            ${elementsHtml}
        </div>
    `;
}

function toggleATPElement(idx) {
    const content = document.getElementById(`atpContent${idx}`);
    const icon = document.getElementById(`atpIcon${idx}`);
    content.classList.toggle('hidden');
    icon.classList.toggle('rotate-180');
}

function showGenerateATPForm() {
    const fase = document.getElementById('atpFase').value || 'D';
    const kelas = document.getElementById('atpKelas').value || '7';
    const cp = getCPByPhase(fase);

    let elementsHtml = '';
    if (cp) {
        cp.capaian.forEach((c, idx) => {
            const tpOptions = c.tujuanPembelajaran.map((tp, i) => `
                <label class="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" name="tp_${idx}" value="${i}" checked
                        class="w-4 h-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
                    <span class="text-sm text-gray-700">${tp}</span>
                </label>
            `).join('');

            elementsHtml += `
                <div class="border rounded-xl p-4 mb-4">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            ${idx + 1}
                        </div>
                        <h4 class="font-semibold text-gray-800">${c.elemen}</h4>
                    </div>
                    <div class="space-y-2 max-h-60 overflow-y-auto">
                        ${tpOptions}
                    </div>
                </div>
            `;
        });
    }

    const modal = `
        <div class="p-6 max-h-[80vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4">
                <h3 class="text-xl font-bold text-gray-800">Generate ATP</h3>
                <button onclick="hideModal()" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p class="text-sm text-blue-700">
                    <i class="fas fa-info-circle mr-2"></i>
                    Pilih Tujuan Pembelajaran yang akan digunakan. TP yang dipilih akan otomatis tersinkron ke Prota dan Promes.
                </p>
            </div>

            <form id="generateATPForm">
                <div class="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Fase</label>
                        <select id="genFase" onchange="updateGenerateForm()"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition">
                            ${getAllPhases().map(p => `
                                <option value="${p}" ${p === fase ? 'selected' : ''}>Fase ${p}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Kelas</label>
                        <select id="genKelas"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition">
                            ${cp?.kelas.map(k => `
                                <option value="${k}" ${k == kelas ? 'selected' : ''}>Kelas ${k}</option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                <div id="tpSelections">
                    ${elementsHtml}
                </div>

                <div class="flex gap-3 pt-4 sticky bottom-0 bg-white">
                    <button type="button" onclick="hideModal()" class="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition">
                        Batal
                    </button>
                    <button type="submit" class="flex-1 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition">
                        <i class="fas fa-magic mr-2"></i>Generate ATP
                    </button>
                </div>
            </form>
        </div>
    `;
    
    showModal(modal);

    document.getElementById('generateATPForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await generateATP();
    });
}

async function generateATP() {
    const tahun = document.getElementById('atpTahun').value;
    const fase = document.getElementById('genFase').value;
    const kelas = document.getElementById('genKelas').value;
    const cp = getCPByPhase(fase);

    if (!cp) {
        showToast('Error', 'Fase tidak valid', 'error');
        return;
    }

    // Collect selected TPs
    const tujuanPembelajaran = [];
    cp.capaian.forEach((c, idx) => {
        const checkboxes = document.querySelectorAll(`input[name="tp_${idx}"]:checked`);
        checkboxes.forEach(cb => {
            const tpIndex = parseInt(cb.value);
            tujuanPembelajaran.push({
                elemen: c.elemen,
                tujuan: c.tujuanPembelajaran[tpIndex],
                urutan: tujuanPembelajaran.length + 1
            });
        });
    });

    if (tujuanPembelajaran.length === 0) {
        showToast('Error', 'Pilih minimal 1 Tujuan Pembelajaran', 'error');
        return;
    }

    showLoading('Generating ATP...');

    try {
        // Check if already exists
        const existing = await db.collection('atp')
            .where('userId', '==', currentUser.uid)
            .where('tahunAjaran', '==', tahun)
            .where('fase', '==', fase)
            .where('kelas', '==', kelas)
            .get();

        if (!existing.empty) {
            // Update existing
            await db.collection('atp').doc(existing.docs[0].id).update({
                tujuanPembelajaran: tujuanPembelajaran,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } else {
            // Create new
            await db.collection('atp').add({
                userId: currentUser.uid,
                tahunAjaran: tahun,
                fase: fase,
                kelas: kelas,
                tujuanPembelajaran: tujuanPembelajaran,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        hideModal();
        hideLoading();
        showToast('Berhasil!', 'ATP berhasil di-generate', 'success');
        
        // Update filter and reload
        document.getElementById('atpFase').value = fase;
        updateKelasOptions();
        document.getElementById('atpKelas').value = kelas;
        await loadATPData();
    } catch (error) {
        hideLoading();
        console.error('Error generating ATP:', error);
        showToast('Gagal!', 'Gagal generate ATP', 'error');
    }
}

async function deleteATP(id) {
    if (!confirm('Hapus ATP ini? Data Prota dan Promes terkait juga akan terpengaruh.')) return;

    showLoading('Menghapus...');

    try {
        await db.collection('atp').doc(id).delete();
        hideLoading();
        showToast('Berhasil!', 'ATP berhasil dihapus', 'success');
        await loadATPData();
    } catch (error) {
        hideLoading();
        showToast('Gagal!', 'Gagal menghapus ATP', 'error');
    }
}

// ==========================================
// REMAINING PAGE CONTENTS (Shortened for space)
// ==========================================

function getProtaContent() {
    return `
        <div class="p-4 lg:p-8">
            <div class="mb-8">
                <h1 class="text-2xl lg:text-3xl font-bold text-gray-800">Program Tahunan (Prota)</h1>
                <p class="text-gray-500 mt-1">Program Tahunan otomatis sinkron dengan Kalender dan ATP</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <div class="grid md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tahun Ajaran</label>
                        <select id="protaTahun" onchange="loadProtaData()" class="w-full px-4 py-3 border border-gray-200 rounded-xl">
                            <option value="2024/2025">2024/2025</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Kelas</label>
                        <select id="protaKelas" onchange="loadProtaData()" class="w-full px-4 py-3 border border-gray-200 rounded-xl">
                            <option value="">Pilih Kelas</option>
                        </select>
                    </div>
                    <div class="flex items-end">
                        <button onclick="generateProta()" class="w-full px-5 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700">
                            <i class="fas fa-sync mr-2"></i>Generate Prota
                        </button>
                    </div>
                </div>
            </div>
            <div id="protaContainer" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div class="text-center py-12 text-gray-400">
                    <i class="fas fa-book text-4xl mb-3"></i>
                    <p>Pilih kelas dan klik Generate Prota</p>
                </div>
            </div>
        </div>
    `;
}

function getPromesContent() {
    return `
        <div class="p-4 lg:p-8">
            <div class="mb-8">
                <h1 class="text-2xl lg:text-3xl font-bold text-gray-800">Program Semester (Promes)</h1>
                <p class="text-gray-500 mt-1">Promes otomatis sinkron dengan Prota, Kalender, dan Jadwal</p>
            </div>
            <div id="promesContainer" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <p class="text-center text-gray-400">Fitur Promes tersedia di Premium</p>
            </div>
        </div>
    `;
}

function getModulAjarContent() {
    return `
        <div class="p-4 lg:p-8">
            <div class="mb-8">
                <h1 class="text-2xl lg:text-3xl font-bold text-gray-800">Modul Ajar</h1>
                <p class="text-gray-500 mt-1">Buat Modul Ajar dengan LKPD terintegrasi</p>
            </div>
            <div id="modulAjarContainer" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <p class="text-center text-gray-400">Fitur Modul Ajar tersedia di Premium</p>
            </div>
        </div>
    `;
}

function getJurnalContent() {
    return `
        <div class="p-4 lg:p-8">
            <div class="mb-8">
                <h1 class="text-2xl lg:text-3xl font-bold text-gray-800">Jurnal & Absensi</h1>
                <p class="text-gray-500 mt-1">Catat kehadiran dan kegiatan pembelajaran</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <p class="text-center text-gray-400">Fitur Jurnal tersedia di Premium</p>
            </div>
        </div>
    `;
}

function getNilaiContent() {
    return `
        <div class="p-4 lg:p-8">
            <div class="mb-8">
                <h1 class="text-2xl lg:text-3xl font-bold text-gray-800">Daftar Nilai</h1>
                <p class="text-gray-500 mt-1">Kelola nilai PH, PTS, PAS, dan Nilai Rapor</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <p class="text-center text-gray-400">Fitur Nilai tersedia di Premium</p>
            </div>
        </div>
    `;
}

function getBankSoalContent() {
    return `
        <div class="p-4 lg:p-8">
            <div class="mb-8">
                <h1 class="text-2xl lg:text-3xl font-bold text-gray-800">Bank Soal</h1>
                <p class="text-gray-500 mt-1">Kelola koleksi soal terintegrasi dengan ATP</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <p class="text-center text-gray-400">Fitur Bank Soal tersedia di Premium</p>
            </div>
        </div>
    `;
}

function getAdminContent() {
    return `
        <div class="p-4 lg:p-8">
            <div class="mb-8">
                <h1 class="text-2xl lg:text-3xl font-bold text-gray-800 text-red-600">
                    <i class="fas fa-shield-alt mr-2"></i>Super Admin Panel
                </h1>
                <p class="text-gray-500 mt-1">Kelola pengguna dan langganan</p>
            </div>
            <div id="adminContainer">
                <!-- Admin content will be loaded here -->
            </div>
        </div>
    `;
}

function getPanduanContent() {
    return `
        <div class="p-4 lg:p-8">
            <div class="mb-8">
                <h1 class="text-2xl lg:text-3xl font-bold text-gray-800">Panduan Penggunaan</h1>
                <p class="text-gray-500 mt-1">Pelajari cara menggunakan Admin Guru Super App</p>
            </div>
            
            <div class="grid lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 space-y-6">
                    <!-- Getting Started -->
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 class="text-xl font-bold text-gray-800 mb-4">
                            <i class="fas fa-rocket text-primary-600 mr-2"></i>Memulai
                        </h2>
                        <div class="space-y-4">
                            <div class="flex gap-4">
                                <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span class="font-bold text-primary-600">1</span>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-800">Lengkapi Profil</h3>
                                    <p class="text-sm text-gray-600">Isi data diri dan satuan pendidikan Anda di menu Profil</p>
                                </div>
                            </div>
                            <div class="flex gap-4">
                                <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span class="font-bold text-primary-600">2</span>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-800">Buat Kalender Pendidikan</h3>
                                    <p class="text-sm text-gray-600">Input tanggal semester dan hari libur untuk perhitungan pekan efektif</p>
                                </div>
                            </div>
                            <div class="flex gap-4">
                                <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span class="font-bold text-primary-600">3</span>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-800">Atur Jadwal Pelajaran</h3>
                                    <p class="text-sm text-gray-600">Buat jadwal mengajar dengan sistem validasi anti-bentrok</p>
                                </div>
                            </div>
                            <div class="flex gap-4">
                                <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span class="font-bold text-primary-600">4</span>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-800">Generate ATP</h3>
                                    <p class="text-sm text-gray-600">Pilih Tujuan Pembelajaran dari CP PAI untuk fase dan kelas Anda</p>
                                </div>
                            </div>
                            <div class="flex gap-4">
                                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span class="font-bold text-green-600">✓</span>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-800">Otomatis!</h3>
                                    <p class="text-sm text-gray-600">Prota, Promes, dan Modul Ajar akan tersinkron otomatis</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Features Guide -->
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 class="text-xl font-bold text-gray-800 mb-4">
                            <i class="fas fa-book-open text-blue-600 mr-2"></i>Panduan Fitur
                        </h2>
                        <div class="space-y-4">
                            <details class="group">
                                <summary class="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-xl">
                                    <span class="font-medium text-gray-800">Import Data Siswa via CSV</span>
                                    <i class="fas fa-chevron-down text-gray-400 group-open:rotate-180 transition"></i>
                                </summary>
                                <div class="p-4 text-sm text-gray-600">
                                    <p class="mb-2">Format CSV yang diperlukan:</p>
                                    <code class="block bg-gray-100 p-2 rounded mb-2">nisn,nama,jenisKelamin,kelas,rombel</code>
                                    <p>Anda dapat menggunakan Google Spreadsheet:</p>
                                    <ol class="list-decimal list-inside space-y-1 mt-2">
                                        <li>Buat spreadsheet dengan kolom sesuai format</li>
                                        <li>File → Share → Publish to web</li>
                                        <li>Pilih format CSV</li>
                                        <li>Copy link dan paste di form import</li>
                                    </ol>
                                </div>
                            </details>
                            <details class="group">
                                <summary class="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-xl">
                                    <span class="font-medium text-gray-800">Mengelola Jadwal Anti-Bentrok</span>
                                    <i class="fas fa-chevron-down text-gray-400 group-open:rotate-180 transition"></i>
                                </summary>
                                <div class="p-4 text-sm text-gray-600">
                                    <p>Sistem akan otomatis mendeteksi konflik jadwal:</p>
                                    <ul class="list-disc list-inside space-y-1 mt-2">
                                        <li>Guru tidak bisa mengajar di 2 kelas berbeda pada jam yang sama</li>
                                        <li>Satu kelas tidak bisa memiliki 2 guru PAI di jam yang sama</li>
                                    </ul>
                                </div>
                            </details>
                            <details class="group">
                                <summary class="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-xl">
                                    <span class="font-medium text-gray-800">Teks Arab (RTL) di Modul Ajar</span>
                                    <i class="fas fa-chevron-down text-gray-400 group-open:rotate-180 transition"></i>
                                </summary>
                                <div class="p-4 text-sm text-gray-600">
                                    <p>Untuk menulis teks Arab, gunakan class <code>arabic-text</code> atau tandai dengan tag khusus. Teks akan otomatis ditampilkan Right-to-Left.</p>
                                </div>
                            </details>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="space-y-6">
                    <div class="bg-primary-50 rounded-2xl p-6 border border-primary-100">
                        <h3 class="font-bold text-primary-800 mb-3">
                            <i class="fas fa-headset mr-2"></i>Butuh Bantuan?
                        </h3>
                        <p class="text-sm text-primary-700 mb-4">Hubungi kami jika ada pertanyaan atau kendala</p>
                        <a href="https://wa.me/6281234567890" target="_blank" 
                            class="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition">
                            <i class="fab fa-whatsapp text-xl"></i>
                            WhatsApp Support
                        </a>
                    </div>

                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 class="font-bold text-gray-800 mb-3">Referensi</h3>
                        <ul class="space-y-2 text-sm">
                            <li>
                                <a href="#" class="text-primary-600 hover:underline flex items-center gap-2">
                                    <i class="fas fa-file-pdf"></i>
                                    Kepka BSKAP 046/2025
                                </a>
                            </li>
                            <li>
                                <a href="#" class="text-primary-600 hover:underline flex items-center gap-2">
                                    <i class="fas fa-external-link-alt"></i>
                                    CP PAI Lengkap
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getAIAssistantContent() {
    return `
        <div class="p-4 lg:p-8">
            <div class="mb-8">
                <h1 class="text-2xl lg:text-3xl font-bold text-gray-800">
                    <i class="fas fa-robot text-blue-600 mr-2"></i>AI Assistant
                </h1>
                <p class="text-gray-500 mt-1">Gunakan prompt khusus untuk membuat konten pembelajaran dengan AI</p>
            </div>
            
            <div class="grid lg:grid-cols-2 gap-6">
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 class="text-lg font-bold text-gray-800 mb-4">Prompt Templates</h2>
                    <div class="space-y-4">
                        <div class="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                            <h3 class="font-semibold text-blue-800 mb-2">📚 Generate Modul Ajar</h3>
                            <p class="text-sm text-blue-700 mb-3">Copy prompt berikut ke ChatGPT/Claude:</p>
                            <div class="bg-white p-3 rounded-lg text-xs text-gray-700 font-mono">
                                Buatlah file CSV dengan format:<br>
                                judul,tujuanPembelajaran,materi,langkahPembelajaran,penilaian,sumberBelajar<br><br>
                                Untuk materi PAI kelas [X] tentang [TOPIK].<br>
                                Sesuaikan dengan Kurikulum Merdeka.
                            </div>
                            <button onclick="copyPrompt(this)" class="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                                <i class="fas fa-copy mr-1"></i>Copy Prompt
                            </button>
                        </div>

                        <div class="p-4 bg-green-50 border border-green-200 rounded-xl">
                            <h3 class="font-semibold text-green-800 mb-2">📝 Generate Bank Soal</h3>
                            <p class="text-sm text-green-700 mb-3">Copy prompt berikut:</p>
                            <div class="bg-white p-3 rounded-lg text-xs text-gray-700 font-mono">
                                Buatlah file CSV dengan format:<br>
                                pertanyaan,opsiA,opsiB,opsiC,opsiD,jawabanBenar,pembahasan,tingkatKesulitan<br><br>
                                Untuk materi [TOPIK] kelas [X].<br>
                                Buat 10 soal pilihan ganda.
                            </div>
                            <button onclick="copyPrompt(this)" class="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                                <i class="fas fa-copy mr-1"></i>Copy Prompt
                            </button>
                        </div>

                        <div class="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                            <h3 class="font-semibold text-purple-800 mb-2">📋 Generate LKPD</h3>
                            <p class="text-sm text-purple-700 mb-3">Copy prompt berikut:</p>
                            <div class="bg-white p-3 rounded-lg text-xs text-gray-700 font-mono">
                                Buatlah file CSV dengan format:<br>
                                judul,petunjuk,kegiatan1,kegiatan2,kegiatan3,refleksi<br><br>
                                Untuk LKPD materi [TOPIK] kelas [X].<br>
                                Gunakan bahasa yang mudah dipahami siswa.
                            </div>
                            <button onclick="copyPrompt(this)" class="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                                <i class="fas fa-copy mr-1"></i>Copy Prompt
                            </button>
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                        <h3 class="font-bold text-yellow-800 mb-3">
                            <i class="fas fa-lightbulb mr-2"></i>Cara Penggunaan
                        </h3>
                        <ol class="text-sm text-yellow-700 space-y-2 list-decimal list-inside">
                            <li>Copy prompt template di atas</li>
                            <li>Paste ke ChatGPT, Claude, atau AI lainnya</li>
                            <li>Sesuaikan [TOPIK] dan [X] dengan kebutuhan</li>
                            <li>Download hasil sebagai file CSV</li>
                            <li>Import CSV ke fitur yang sesuai di aplikasi</li>
                        </ol>
                    </div>

                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 class="font-bold text-gray-800 mb-3">Tips Prompt</h3>
                        <ul class="text-sm text-gray-600 space-y-2">
                            <li class="flex gap-2">
                                <i class="fas fa-check text-green-500 mt-1"></i>
                                <span>Selalu sebutkan kelas dan jenjang pendidikan</span>
                            </li>
                            <li class="flex gap-2">
                                <i class="fas fa-check text-green-500 mt-1"></i>
                                <span>Minta AI untuk menyesuaikan dengan Kurikulum Merdeka</span>
                            </li>
                            <li class="flex gap-2">
                                <i class="fas fa-check text-green-500 mt-1"></i>
                                <span>Untuk teks Arab, minta AI menuliskan dalam huruf Arab</span>
                            </li>
                            <li class="flex gap-2">
                                <i class="fas fa-check text-green-500 mt-1"></i>
                                <span>Review dan edit hasil sebelum digunakan</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getUpgradeContent() {
    return `
        <div class="p-4 lg:p-8">
            <div class="max-w-3xl mx-auto text-center mb-12">
                <div class="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                    <i class="fas fa-crown text-yellow-500 text-4xl"></i>
                </div>
                <h1 class="text-3xl font-bold text-gray-800 mb-4">Upgrade ke Premium</h1>
                <p class="text-gray-600">Dapatkan akses penuh ke semua fitur Admin Guru Super App</p>
            </div>

            <div class="max-w-lg mx-auto">
                <div class="bg-white rounded-2xl shadow-xl border-2 border-primary-500 p-8">
                    <div class="text-center mb-6">
                        <span class="px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">PREMIUM</span>
                        <p class="text-5xl font-bold text-gray-800 mt-4">Rp 99.000</p>
                        <p class="text-gray-500">per tahun</p>
                    </div>

                    <ul class="space-y-3 mb-8">
                        <li class="flex items-center gap-3 text-gray-700">
                            <i class="fas fa-check-circle text-green-500"></i>
                            <span>Semua fitur Free (Kalender, Jadwal, ATP, Prota)</span>
                        </li>
                        <li class="flex items-center gap-3 text-gray-700">
                            <i class="fas fa-check-circle text-green-500"></i>
                            <span>Promes Lengkap dengan alokasi waktu otomatis</span>
                        </li>
                        <li class="flex items-center gap-3 text-gray-700">
                            <i class="fas fa-check-circle text-green-500"></i>
                            <span>Modul Ajar + LKPD dengan support teks Arab</span>
                        </li>
                        <li class="flex items-center gap-3 text-gray-700">
                            <i class="fas fa-check-circle text-green-500"></i>
                            <span>Bank Soal unlimited terintegrasi ATP</span>
                        </li>
                        <li class="flex items-center gap-3 text-gray-700">
                            <i class="fas fa-check-circle text-green-500"></i>
                            <span>Jurnal Pembelajaran & Absensi Digital</span>
                        </li>
                        <li class="flex items-center gap-3 text-gray-700">
                            <i class="fas fa-check-circle text-green-500"></i>
                            <span>Daftar Nilai (PH, PTS, PAS, Rapor)</span>
                        </li>
                        <li class="flex items-center gap-3 text-gray-700">
                            <i class="fas fa-check-circle text-green-500"></i>
                            <span>Export PDF/Excel</span>
                        </li>
                        <li class="flex items-center gap-3 text-gray-700">
                            <i class="fas fa-check-circle text-green-500"></i>
                            <span>Priority Support via WhatsApp</span>
                        </li>
                    </ul>

                    <button onclick="processPayment()" class="w-full py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition">
                        <i class="fas fa-credit-card mr-2"></i>Bayar Sekarang
                    </button>

                    <p class="text-center text-sm text-gray-500 mt-4">
                        Pembayaran aman via Transfer Bank / E-Wallet
                    </p>
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// INITIALIZATION FUNCTIONS
// ==========================================

function initProta() {
    // Implementation for Prota
    console.log('Prota initialized');
}

function initPromes() {
    console.log('Promes initialized');
}

function initModulAjar() {
    console.log('Modul Ajar initialized');
}

function initJurnal() {
    console.log('Jurnal initialized');
}

function initNilai() {
    console.log('Nilai initialized');
}

function initBankSoal() {
    console.log('Bank Soal initialized');
}

function initAdmin() {
    if (!isSuperAdmin()) {
        document.getElementById('adminContainer').innerHTML = '<p class="text-red-500">Akses ditolak</p>';
        return;
    }
    loadAdminData();
}

async function loadAdminData() {
    // Load all users for admin
    try {
        const snapshot = await db.collection('users').get();
        let usersHtml = '';
        let totalUsers = 0;
        let premiumUsers = 0;
        let freeUsers = 0;

        snapshot.forEach(doc => {
            const user = doc.data();
            totalUsers++;
            
            const isPremium = user.subscription === 'premium' || user.subscription === 'school';
            if (isPremium) premiumUsers++;
            else freeUsers++;

            const badgeClass = isPremium 
                ? 'bg-yellow-100 text-yellow-700' 
                : 'bg-gray-100 text-gray-600';
            const badgeText = user.role === 'superadmin' ? 'Super Admin' : (isPremium ? 'Premium' : 'Free');

            usersHtml += `
                <div class="flex items-center justify-between p-4 bg-white rounded-xl border hover:shadow-md transition">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                            <span class="text-primary-700 font-bold">${(user.name || 'U').charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                            <p class="font-medium text-gray-800">${user.name || 'No Name'}</p>
                            <p class="text-sm text-gray-500">${user.email}</p>
                            <p class="text-xs text-gray-400">${user.profile?.school || 'Sekolah belum diisi'}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="px-3 py-1 rounded-full text-xs font-medium ${badgeClass}">${badgeText}</span>
                        <div class="relative">
                            <button onclick="toggleAdminUserMenu('${doc.id}')" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <div id="adminUserMenu_${doc.id}" class="hidden absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border py-2 z-10">
                                <button onclick="setUserPremium('${doc.id}', true)" class="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-50">
                                    <i class="fas fa-crown text-yellow-500 w-4"></i>
                                    <span>Set Premium</span>
                                </button>
                                <button onclick="setUserPremium('${doc.id}', false)" class="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-50">
                                    <i class="fas fa-user w-4"></i>
                                    <span>Set Free</span>
                                </button>
                                <hr class="my-1">
                                <button onclick="deleteUser('${doc.id}')" class="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-red-50">
                                    <i class="fas fa-trash w-4"></i>
                                    <span>Hapus User</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        document.getElementById('adminContainer').innerHTML = `
            <!-- Stats -->
            <div class="grid grid-cols-3 gap-4 mb-6">
                <div class="bg-white rounded-xl p-6 border">
                    <p class="text-3xl font-bold text-gray-800">${totalUsers}</p>
                    <p class="text-sm text-gray-500">Total Users</p>
                </div>
                <div class="bg-white rounded-xl p-6 border">
                    <p class="text-3xl font-bold text-yellow-600">${premiumUsers}</p>
                    <p class="text-sm text-gray-500">Premium Users</p>
                </div>
                <div class="bg-white rounded-xl p-6 border">
                    <p class="text-3xl font-bold text-gray-600">${freeUsers}</p>
                    <p class="text-sm text-gray-500">Free Users</p>
                </div>
            </div>

            <!-- User List -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-lg font-bold text-gray-800">Daftar Pengguna</h2>
                    <div class="relative">
                        <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input type="text" id="searchUser" placeholder="Cari user..." 
                            onkeyup="filterAdminUsers()"
                            class="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500">
                    </div>
                </div>
                <div id="usersList" class="space-y-3">
                    ${usersHtml}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading admin data:', error);
        document.getElementById('adminContainer').innerHTML = '<p class="text-red-500">Gagal memuat data</p>';
    }
}

function toggleAdminUserMenu(userId) {
    // Close all other menus first
    document.querySelectorAll('[id^="adminUserMenu_"]').forEach(menu => {
        if (menu.id !== `adminUserMenu_${userId}`) {
            menu.classList.add('hidden');
        }
    });
    
    const menu = document.getElementById(`adminUserMenu_${userId}`);
    menu.classList.toggle('hidden');
}

// Close admin menus when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('[onclick^="toggleAdminUserMenu"]') && !e.target.closest('[id^="adminUserMenu_"]')) {
        document.querySelectorAll('[id^="adminUserMenu_"]').forEach(menu => {
            menu.classList.add('hidden');
        });
    }
});

async function setUserPremium(userId, isPremium) {
    showLoading('Mengupdate...');
    
    try {
        const updateData = {
            subscription: isPremium ? 'premium' : 'free',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (isPremium) {
            // Set expiry to 1 year from now
            const expiry = new Date();
            expiry.setFullYear(expiry.getFullYear() + 1);
            updateData.subscriptionExpiry = firebase.firestore.Timestamp.fromDate(expiry);
        } else {
            updateData.subscriptionExpiry = null;
        }

        await db.collection('users').doc(userId).update(updateData);
        
        hideLoading();
        showToast('Berhasil!', `User berhasil diupdate ke ${isPremium ? 'Premium' : 'Free'}`, 'success');
        await loadAdminData();
    } catch (error) {
        hideLoading();
        console.error('Error updating user:', error);
        showToast('Gagal!', 'Gagal mengupdate user', 'error');
    }
}

async function deleteUser(userId) {
    if (!confirm('Hapus user ini? Semua data akan dihapus permanen.')) return;
    
    showLoading('Menghapus...');
    
    try {
        // Delete user document
        await db.collection('users').doc(userId).delete();
        
        // Also delete related data (optional - can be done via Cloud Functions)
        const collections = ['calendars', 'schedules', 'students', 'atp', 'prota', 'promes', 'modulAjar', 'jurnal', 'nilai', 'bankSoal'];
        
        for (const col of collections) {
            const snapshot = await db.collection(col).where('userId', '==', userId).get();
            const batch = db.batch();
            snapshot.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
        }

        hideLoading();
        showToast('Berhasil!', 'User berhasil dihapus', 'success');
        await loadAdminData();
    } catch (error) {
        hideLoading();
        console.error('Error deleting user:', error);
        showToast('Gagal!', 'Gagal menghapus user', 'error');
    }
}

function filterAdminUsers() {
    const search = document.getElementById('searchUser').value.toLowerCase();
    const userCards = document.querySelectorAll('#usersList > div');
    
    userCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(search) ? 'flex' : 'none';
    });
}

function initPanduan() {
    console.log('Panduan initialized');
}

function initAIAssistant() {
    console.log('AI Assistant initialized');
}

function copyPrompt(button) {
    const promptText = button.previousElementSibling.textContent;
    navigator.clipboard.writeText(promptText).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check mr-1"></i>Copied!';
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
    });
}

function processPayment() {
    const modal = `
        <div class="p-6">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-gray-800">Pembayaran Premium</h3>
                <button onclick="hideModal()" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="text-center mb-6">
                <p class="text-3xl font-bold text-primary-600">Rp 99.000</p>
                <p class="text-gray-500">Langganan 1 Tahun</p>
            </div>

            <div class="space-y-4 mb-6">
                <div class="p-4 bg-gray-50 rounded-xl">
                    <h4 class="font-semibold text-gray-800 mb-2">Transfer Bank</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-500">Bank BCA</span>
                            <span class="font-mono font-medium">1234567890</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-500">Atas Nama</span>
                            <span class="font-medium">Admin Guru App</span>
                        </div>
                    </div>
                </div>

                <div class="p-4 bg-gray-50 rounded-xl">
                    <h4 class="font-semibold text-gray-800 mb-2">E-Wallet</h4>
                    <div class="flex gap-2">
                        <span class="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm">GoPay</span>
                        <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">OVO</span>
                        <span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm">ShopeePay</span>
                    </div>
                    <p class="text-sm text-gray-500 mt-2">Nomor: 081234567890</p>
                </div>
            </div>

            <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-xl mb-6">
                <p class="text-sm text-yellow-700">
                    <i class="fas fa-info-circle mr-2"></i>
                    Setelah transfer, kirim bukti pembayaran via WhatsApp untuk aktivasi akun Premium.
                </p>
            </div>

            <a href="https://wa.me/6281234567890?text=Halo,%20saya%20ingin%20konfirmasi%20pembayaran%20Premium%20Admin%20Guru%20App.%20Email:%20${currentUser?.email}" 
                target="_blank"
                class="block w-full py-3 bg-green-500 text-white text-center rounded-xl font-semibold hover:bg-green-600 transition">
                <i class="fab fa-whatsapp mr-2"></i>Konfirmasi via WhatsApp
            </a>
        </div>
    `;
    
    showModal(modal);
}

async function generateProta() {
    const tahun = document.getElementById('protaTahun').value;
    const kelas = document.getElementById('protaKelas').value;

    if (!kelas) {
        showToast('Error', 'Pilih kelas terlebih dahulu', 'error');
        return;
    }

    showLoading('Generating Prota...');

    try {
        // Get calendar data
        const calendarSnap = await db.collection('calendars')
            .where('userId', '==', currentUser.uid)
            .where('tahunAjaran', '==', tahun)
            .get();

        let semester1Data = null;
        let semester2Data = null;

        calendarSnap.forEach(doc => {
            const data = doc.data();
            if (data.semester === 1) semester1Data = data;
            if (data.semester === 2) semester2Data = data;
        });

        // Get ATP data
        const fase = getPhaseByGrade(kelas);
        const atpSnap = await db.collection('atp')
            .where('userId', '==', currentUser.uid)
            .where('tahunAjaran', '==', tahun)
            .where('kelas', '==', kelas)
            .get();

        let atpTPs = [];
        if (!atpSnap.empty) {
            atpTPs = atpSnap.docs[0].data().tujuanPembelajaran || [];
        }

        // Calculate JP allocation
        const totalWeeks = (semester1Data?.effectiveWeeks || 0) + (semester2Data?.effectiveWeeks || 0);
        const jpPerWeek = semester1Data?.jpPerWeek || semester2Data?.jpPerWeek || 4;
        const totalJP = totalWeeks * jpPerWeek;
        const jpPerTP = atpTPs.length > 0 ? Math.floor(totalJP / atpTPs.length) : 0;

        // Generate Prota data
        const protaData = {
            userId: currentUser.uid,
            tahunAjaran: tahun,
            kelas: kelas,
            fase: fase,
            semester1: {
                weeks: semester1Data?.effectiveWeeks || 0,
                jp: (semester1Data?.effectiveWeeks || 0) * jpPerWeek
            },
            semester2: {
                weeks: semester2Data?.effectiveWeeks || 0,
                jp: (semester2Data?.effectiveWeeks || 0) * jpPerWeek
            },
            totalWeeks: totalWeeks,
            totalJP: totalJP,
            jpPerWeek: jpPerWeek,
            tujuanPembelajaran: atpTPs.map((tp, idx) => ({
                ...tp,
                alokasi: jpPerTP,
                semester: idx < Math.ceil(atpTPs.length / 2) ? 1 : 2
            })),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Check if exists
        const existingSnap = await db.collection('prota')
            .where('userId', '==', currentUser.uid)
            .where('tahunAjaran', '==', tahun)
            .where('kelas', '==', kelas)
            .get();

        if (!existingSnap.empty) {
            await db.collection('prota').doc(existingSnap.docs[0].id).update(protaData);
        } else {
            await db.collection('prota').add(protaData);
        }

        hideLoading();
        showToast('Berhasil!', 'Prota berhasil di-generate', 'success');
        
        // Render Prota
        renderProta(protaData);

    } catch (error) {
        hideLoading();
        console.error('Error generating prota:', error);
        showToast('Gagal!', 'Gagal generate Prota', 'error');
    }
}

function renderProta(data) {
    const container = document.getElementById('protaContainer');

    // Group TPs by element
    const tpByElement = {};
    data.tujuanPembelajaran.forEach(tp => {
        if (!tpByElement[tp.elemen]) {
            tpByElement[tp.elemen] = [];
        }
        tpByElement[tp.elemen].push(tp);
    });

    let tableHtml = '';
    let no = 1;
    Object.entries(tpByElement).forEach(([elemen, tps]) => {
        tps.forEach((tp, idx) => {
            tableHtml += `
                <tr class="border-t border-gray-100 ${idx === 0 ? 'border-t-2' : ''}">
                    <td class="px-4 py-3 text-sm text-gray-600">${no}</td>
                    ${idx === 0 ? `<td class="px-4 py-3 text-sm font-medium text-gray-800" rowspan="${tps.length}">${elemen}</td>` : ''}
                    <td class="px-4 py-3 text-sm text-gray-700">${tp.tujuan}</td>
                    <td class="px-4 py-3 text-sm text-center text-gray-600">${tp.alokasi} JP</td>
                    <td class="px-4 py-3 text-sm text-center">
                        <span class="px-2 py-1 rounded-full text-xs ${tp.semester === 1 ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}">
                            Smt ${tp.semester}
                        </span>
                    </td>
                </tr>
            `;
            no++;
        });
    });

    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-xl font-bold text-gray-800">Program Tahunan (Prota)</h2>
                    <p class="text-sm text-gray-500">Kelas ${data.kelas} - Tahun Ajaran ${data.tahunAjaran}</p>
                </div>
                <button onclick="exportProta()" class="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-200">
                    <i class="fas fa-download mr-2"></i>Export
                </button>
            </div>

            <!-- Summary -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="p-4 bg-blue-50 rounded-xl text-center">
                    <p class="text-2xl font-bold text-blue-600">${data.semester1.weeks}</p>
                    <p class="text-xs text-gray-500">Pekan Efektif Smt 1</p>
                </div>
                <div class="p-4 bg-green-50 rounded-xl text-center">
                    <p class="text-2xl font-bold text-green-600">${data.semester2.weeks}</p>
                    <p class="text-xs text-gray-500">Pekan Efektif Smt 2</p>
                </div>
                <div class="p-4 bg-purple-50 rounded-xl text-center">
                    <p class="text-2xl font-bold text-purple-600">${data.totalWeeks}</p>
                    <p class="text-xs text-gray-500">Total Pekan</p>
                </div>
                <div class="p-4 bg-orange-50 rounded-xl text-center">
                    <p class="text-2xl font-bold text-orange-600">${data.totalJP}</p>
                    <p class="text-xs text-gray-500">Total JP</p>
                </div>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-12">No</th>
                            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-40">Elemen</th>
                            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tujuan Pembelajaran</th>
                            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-24">Alokasi</th>
                            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-24">Semester</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableHtml || '<tr><td colspan="5" class="px-4 py-8 text-center text-gray-400">Tidak ada data TP. Generate ATP terlebih dahulu.</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function exportProta() {
    showToast('Info', 'Fitur export akan segera tersedia', 'info');
}

function exportATP() {
    showToast('Info', 'Fitur export akan segera tersedia', 'info');
}

// ==========================================
// AUTH STATE OBSERVER
// ==========================================

auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        
        // Get user data from Firestore
        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                userData = userDoc.data();
                
                // Update UI
                document.getElementById('userName').textContent = userData.name || 'User';
                document.getElementById('userInitial').textContent = (userData.name || 'U').charAt(0).toUpperCase();
                document.getElementById('mobileUserInitial').textContent = (userData.name || 'U').charAt(0).toUpperCase();
                
                // Update subscription badge
                const subText = isPremiumUser() ? 'Premium' : 'Free Plan';
                document.getElementById('userSubscription').textContent = subText;

                // Show admin menu if super admin
                if (isSuperAdmin()) {
                    document.getElementById('adminMenu').classList.remove('hidden');
                }

                // Load dashboard
                loadPage('dashboard');
            } else {
                // Create user document if not exists
                await db.collection('users').doc(user.uid).set({
                    name: user.displayName || 'User',
                    email: user.email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    subscription: 'free',
                    role: user.email === 'afifaro@gmail.com' ? 'superadmin' : 'user',
                    profile: {}
                });
                
                window.location.reload();
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            showToast('Error', 'Gagal memuat data user', 'error');
        }
    } else {
        // Not logged in, redirect to auth
        window.location.href = 'auth.html';
    }
});

console.log('App.js loaded successfully');