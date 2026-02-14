/**
 * Profile Management Module
 * ADMIN PAI Super App
 */

// Global variables for profile
let currentClassId = null;

// Initialize Profile Page
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        showLoading('Memuat data profil...');

        try {
            const userData = await getUserData(user.uid);
            if (userData) {
                populateUserForm(userData);
                populateSchoolForm(userData.school || {});
                populatePrincipalForm(userData.principal || {});
                updateSidebarUser(userData);
                loadClasses(user.uid);
                loadStats(user.uid);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            showToast('Gagal memuat data profil', 'error');
        } finally {
            hideLoading();
        }
    });

    // Setup form handlers
    setupFormHandlers();

    // Setup grade change listener for fase
    document.getElementById('classGrade')?.addEventListener('change', function() {
        const fase = getFaseByGrade(this.value);
        document.getElementById('classFase').value = fase ? fase.name : '';
    });

    // Photo upload handler
    document.getElementById('photoInput')?.addEventListener('change', handlePhotoUpload);
});

// Populate User Form
function populateUserForm(userData) {
    document.getElementById('userName').value = userData.name || '';
    document.getElementById('userNip').value = userData.profile?.nip || '';
    document.getElementById('userEmail').value = userData.email || '';
    document.getElementById('userPhone').value = userData.profile?.phone || '';
    document.getElementById('userLevel').value = userData.level || '';
    document.getElementById('userAddress').value = userData.profile?.address || '';

    // Update display
    document.getElementById('displayName').textContent = userData.name || 'Pengguna';
    document.getElementById('displayEmail').textContent = userData.email || '-';
    document.getElementById('displayLevel').textContent = userData.level ? `Guru PAI ${userData.level}` : 'Guru PAI';

    // Profile photo
    if (userData.profile?.photo) {
        document.getElementById('profilePhoto').innerHTML = `
            <img src="${userData.profile.photo}" class="w-full h-full object-cover" alt="Profile">
        `;
    }
}

// Populate School Form
function populateSchoolForm(school) {
    document.getElementById('schoolName').value = school.name || '';
    document.getElementById('schoolNpsn').value = school.npsn || '';
    document.getElementById('schoolLevel').value = school.level || '';
    document.getElementById('schoolStatus').value = school.status || '';
    document.getElementById('schoolProvince').value = school.province || '';
    document.getElementById('schoolCity').value = school.city || '';
    document.getElementById('schoolDistrict').value = school.district || '';
    document.getElementById('schoolAddress').value = school.address || '';
    document.getElementById('schoolPhone').value = school.phone || '';
    document.getElementById('schoolEmail').value = school.email || '';
    document.getElementById('schoolYear').value = school.year || getCurrentAcademicYear();
}

// Populate Principal Form
function populatePrincipalForm(principal) {
    document.getElementById('principalName').value = principal.name || '';
    document.getElementById('principalNip').value = principal.nip || '';
    document.getElementById('principalRank').value = principal.rank || '';
    document.getElementById('principalEducation').value = principal.education || '';
}

// Update Sidebar User Info
function updateSidebarUser(userData) {
    const sidebarName = document.getElementById('sidebarUserName');
    const sidebarRole = document.getElementById('sidebarUserRole');
    const sidebarPhoto = document.getElementById('sidebarUserPhoto');

    if (sidebarName) sidebarName.textContent = userData.name || 'Pengguna';
    if (sidebarRole) sidebarRole.textContent = userData.level ? `Guru PAI ${userData.level}` : 'Guru PAI';

    if (sidebarPhoto && userData.profile?.photo) {
        sidebarPhoto.innerHTML = `<img src="${userData.profile.photo}" class="w-full h-full rounded-full object-cover" alt="Profile">`;
    }
}

// Load Statistics
async function loadStats(userId) {
    try {
        const classesSnap = await db.collection('users').doc(userId).collection('classes').get();
        document.getElementById('statClasses').textContent = classesSnap.size;

        let totalStudents = 0;
        for (const doc of classesSnap.docs) {
            const studentsSnap = await db.collection('users').doc(userId)
                .collection('classes').doc(doc.id)
                .collection('students').get();
            totalStudents += studentsSnap.size;
        }
        document.getElementById('statStudents').textContent = totalStudents;

        const modulesSnap = await db.collection('users').doc(userId).collection('modules').get();
        document.getElementById('statModules').textContent = modulesSnap.size;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Setup Form Handlers
function setupFormHandlers() {
    // User Profile Form
    document.getElementById('userProfileForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        await saveUserProfile();
    });

    // School Form
    document.getElementById('schoolForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        await saveSchoolData();
    });

    // Principal Form
    document.getElementById('principalForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        await savePrincipalData();
    });

    // Add Class Form
    document.getElementById('addClassForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        await addClass();
    });
}

// Save User Profile
async function saveUserProfile() {
    const user = auth.currentUser;
    if (!user) return;

    showLoading('Menyimpan data...');

    try {
        const data = {
            name: document.getElementById('userName').value.trim(),
            level: document.getElementById('userLevel').value,
            profile: {
                nip: document.getElementById('userNip').value.trim(),
                phone: document.getElementById('userPhone').value.trim(),
                address: document.getElementById('userAddress').value.trim()
            }
        };

        await updateUserData(user.uid, data);

        // Update display
        document.getElementById('displayName').textContent = data.name;
        document.getElementById('displayLevel').textContent = `Guru PAI ${data.level}`;
        document.getElementById('sidebarUserName').textContent = data.name;
        document.getElementById('sidebarUserRole').textContent = `Guru PAI ${data.level}`;

        showToast('Profil berhasil disimpan', 'success');
        logActivity('Memperbarui profil pengguna', 'user', 'primary');
    } catch (error) {
        console.error('Error saving profile:', error);
        showToast('Gagal menyimpan profil', 'error');
    } finally {
        hideLoading();
    }
}

// Save School Data
async function saveSchoolData() {
    const user = auth.currentUser;
    if (!user) return;

    showLoading('Menyimpan data sekolah...');

    try {
        const schoolData = {
            name: document.getElementById('schoolName').value.trim(),
            npsn: document.getElementById('schoolNpsn').value.trim(),
            level: document.getElementById('schoolLevel').value,
            status: document.getElementById('schoolStatus').value,
            province: document.getElementById('schoolProvince').value.trim(),
            city: document.getElementById('schoolCity').value.trim(),
            district: document.getElementById('schoolDistrict').value.trim(),
            address: document.getElementById('schoolAddress').value.trim(),
            phone: document.getElementById('schoolPhone').value.trim(),
            email: document.getElementById('schoolEmail').value.trim(),
            year: document.getElementById('schoolYear').value.trim()
        };

        await db.collection('users').doc(user.uid).update({
            school: schoolData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        showToast('Data sekolah berhasil disimpan', 'success');
        logActivity('Memperbarui data sekolah', 'school', 'blue');
    } catch (error) {
        console.error('Error saving school data:', error);
        showToast('Gagal menyimpan data sekolah', 'error');
    } finally {
        hideLoading();
    }
}

// Save Principal Data
async function savePrincipalData() {
    const user = auth.currentUser;
    if (!user) return;

    showLoading('Menyimpan data kepala sekolah...');

    try {
        const principalData = {
            name: document.getElementById('principalName').value.trim(),
            nip: document.getElementById('principalNip').value.trim(),
            rank: document.getElementById('principalRank').value.trim(),
            education: document.getElementById('principalEducation').value
        };

        await db.collection('users').doc(user.uid).update({
            principal: principalData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        showToast('Data kepala sekolah berhasil disimpan', 'success');
        logActivity('Memperbarui data kepala sekolah', 'user-tie', 'purple');
    } catch (error) {
        console.error('Error saving principal data:', error);
        showToast('Gagal menyimpan data kepala sekolah', 'error');
    } finally {
        hideLoading();
    }
}

// Handle Photo Upload
async function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        showToast('File harus berupa gambar', 'error');
        return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showToast('Ukuran file maksimal 2MB', 'error');
        return;
    }

    showLoading('Mengupload foto...');

    try {
        // Convert to base64 (for simplicity, in production use Firebase Storage)
        const reader = new FileReader();
        reader.onload = async function(event) {
            const photoData = event.target.result;
            
            const user = auth.currentUser;
            if (!user) return;

            // Get current profile data
            const userData = await getUserData(user.uid);
            const profile = userData.profile || {};
            profile.photo = photoData;

            await db.collection('users').doc(user.uid).update({
                profile: profile,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Update display
            document.getElementById('profilePhoto').innerHTML = `
                <img src="${photoData}" class="w-full h-full object-cover" alt="Profile">
            `;
            
            const sidebarPhoto = document.getElementById('sidebarUserPhoto');
            if (sidebarPhoto) {
                sidebarPhoto.innerHTML = `<img src="${photoData}" class="w-full h-full rounded-full object-cover" alt="Profile">`;
            }

            hideLoading();
            showToast('Foto profil berhasil diupdate', 'success');
        };
        reader.readAsDataURL(file);
    } catch (error) {
        console.error('Error uploading photo:', error);
        hideLoading();
        showToast('Gagal mengupload foto', 'error');
    }
}

// Load Classes
async function loadClasses(userId) {
    const container = document.getElementById('classesList');
    
    try {
        const classesSnap = await db.collection('users').doc(userId)
            .collection('classes')
            .orderBy('grade')
            .orderBy('name')
            .get();

        if (classesSnap.empty) {
            container.innerHTML = `
                <div class="text-center py-12 text-gray-400">
                    <i class="fas fa-chalkboard text-5xl mb-3"></i>
                    <p>Belum ada rombongan belajar</p>
                    <p class="text-sm mt-1">Klik tombol "Tambah Rombel" untuk menambahkan</p>
                </div>
            `;
            return;
        }

        let html = '';
        for (const doc of classesSnap.docs) {
            const data = doc.data();
            
            // Get student count
            const studentsSnap = await db.collection('users').doc(userId)
                .collection('classes').doc(doc.id)
                .collection('students').get();

            const fase = getFaseByGrade(data.grade);

            html += `
                <div class="flex items-center justify-between p-4 border rounded-xl hover:shadow-md transition">
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                            <span class="text-lg font-bold text-primary">${data.grade}</span>
                        </div>
                        <div>
                            <h4 class="font-semibold text-dark">${data.name}</h4>
                            <p class="text-sm text-gray-500">
                                ${fase?.name || ''} • ${studentsSnap.size} siswa
                                ${data.homeroom ? ` • Wali: ${data.homeroom}` : ''}
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="showStudents('${doc.id}', '${data.name}')" class="px-3 py-2 text-primary hover:bg-primary/10 rounded-lg transition" title="Lihat Siswa">
                            <i class="fas fa-users"></i>
                        </button>
                        <button onclick="editClass('${doc.id}')" class="px-3 py-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteClass('${doc.id}', '${data.name}')" class="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Hapus">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading classes:', error);
        container.innerHTML = `
            <div class="text-center py-12 text-red-400">
                <i class="fas fa-exclamation-circle text-5xl mb-3"></i>
                <p>Gagal memuat data rombel</p>
            </div>
        `;
    }
}

// Show Add Class Modal
function showAddClassModal() {
    document.getElementById('addClassModal').classList.remove('hidden');
    document.getElementById('addClassForm').reset();
    document.getElementById('classFase').value = '';
}

// Hide Add Class Modal
function hideAddClassModal() {
    document.getElementById('addClassModal').classList.add('hidden');
}

// Add Class
async function addClass() {
    const user = auth.currentUser;
    if (!user) return;

    const className = document.getElementById('className').value.trim();
    const classGrade = document.getElementById('classGrade').value;
    const classHomeroom = document.getElementById('classHomeroom').value.trim();

    if (!className || !classGrade) {
        showToast('Nama kelas dan tingkat harus diisi', 'error');
        return;
    }

    showLoading('Menambahkan rombel...');

    try {
        const fase = getFaseByGrade(classGrade);

        await db.collection('users').doc(user.uid).collection('classes').add({
            name: className,
            grade: parseInt(classGrade),
            fase: fase?.id || null,
            faseName: fase?.name || null,
            homeroom: classHomeroom,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        hideAddClassModal();
        loadClasses(user.uid);
        loadStats(user.uid);

        showToast('Rombel berhasil ditambahkan', 'success');
        logActivity(`Menambahkan rombel ${className}`, 'chalkboard', 'primary');
    } catch (error) {
        console.error('Error adding class:', error);
        showToast('Gagal menambahkan rombel', 'error');
    } finally {
        hideLoading();
    }
}

// Delete Class
async function deleteClass(classId, className) {
    const confirmed = await confirmDialog(`Hapus rombel "${className}"?\nSemua data siswa dalam rombel ini juga akan dihapus.`);
    if (!confirmed) return;

    const user = auth.currentUser;
    if (!user) return;

    showLoading('Menghapus rombel...');

    try {
        // Delete all students in the class first
        const studentsSnap = await db.collection('users').doc(user.uid)
            .collection('classes').doc(classId)
            .collection('students').get();

        const batch = db.batch();
        studentsSnap.forEach(doc => {
            batch.delete(doc.ref);
        });

        // Delete the class
        batch.delete(db.collection('users').doc(user.uid).collection('classes').doc(classId));

        await batch.commit();

        loadClasses(user.uid);
        loadStats(user.uid);

        showToast('Rombel berhasil dihapus', 'success');
        logActivity(`Menghapus rombel ${className}`, 'trash', 'red');
    } catch (error) {
        console.error('Error deleting class:', error);
        showToast('Gagal menghapus rombel', 'error');
    } finally {
        hideLoading();
    }
}

// Show Students Modal
async function showStudents(classId, className) {
    currentClassId = classId;
    document.getElementById('studentListTitle').textContent = `Daftar Peserta Didik - ${className}`;
    document.getElementById('studentListModal').classList.remove('hidden');
    hideAddStudentForm();

    await loadStudents(classId);
}

// Hide Student List Modal
function hideStudentListModal() {
    document.getElementById('studentListModal').classList.add('hidden');
    currentClassId = null;
}

// Load Students
async function loadStudents(classId) {
    const user = auth.currentUser;
    if (!user) return;

    const tbody = document.getElementById('studentTableBody');
    tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8"><div class="spinner mx-auto"></div></td></tr>';

    try {
        const studentsSnap = await db.collection('users').doc(user.uid)
            .collection('classes').doc(classId)
            .collection('students')
            .orderBy('name')
            .get();

        if (studentsSnap.empty) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-400">Belum ada data siswa</td></tr>';
            return;
        }

        let html = '';
        let no = 1;
        studentsSnap.forEach(doc => {
            const data = doc.data();
            html += `
                <tr>
                    <td class="text-center">${no++}</td>
                    <td>${data.name}</td>
                    <td>${data.nis || '-'}</td>
                    <td class="text-center">${data.gender === 'L' ? 'Laki-laki' : data.gender === 'P' ? 'Perempuan' : '-'}</td>
                    <td class="text-center">
                        <button onclick="editStudent('${doc.id}')" class="text-blue-500 hover:text-blue-700 mx-1" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteStudent('${doc.id}', '${data.name}')" class="text-red-500 hover:text-red-700 mx-1" title="Hapus">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    } catch (error) {
        console.error('Error loading students:', error);
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-red-400">Gagal memuat data siswa</td></tr>';
    }
}

// Show Add Student Form
function showAddStudentForm() {
    document.getElementById('addStudentForm').classList.remove('hidden');
    document.getElementById('newStudentName').value = '';
    document.getElementById('newStudentNis').value = '';
    document.getElementById('newStudentGender').value = '';
    document.getElementById('newStudentName').focus();
}

// Hide Add Student Form
function hideAddStudentForm() {
    document.getElementById('addStudentForm').classList.add('hidden');
}

// Save New Student
async function saveNewStudent() {
    const user = auth.currentUser;
    if (!user || !currentClassId) return;

    const name = document.getElementById('newStudentName').value.trim();
    const nis = document.getElementById('newStudentNis').value.trim();
    const gender = document.getElementById('newStudentGender').value;

    if (!name) {
        showToast('Nama siswa harus diisi', 'error');
        return;
    }

    try {
        await db.collection('users').doc(user.uid)
            .collection('classes').doc(currentClassId)
            .collection('students').add({
                name,
                nis,
                gender,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

        hideAddStudentForm();
        loadStudents(currentClassId);
        loadStats(user.uid);

        showToast('Siswa berhasil ditambahkan', 'success');
    } catch (error) {
        console.error('Error adding student:', error);
        showToast('Gagal menambahkan siswa', 'error');
    }
}

// Delete Student
async function deleteStudent(studentId, studentName) {
    const confirmed = await confirmDialog(`Hapus siswa "${studentName}"?`);
    if (!confirmed) return;

    const user = auth.currentUser;
    if (!user || !currentClassId) return;

    try {
        await db.collection('users').doc(user.uid)
            .collection('classes').doc(currentClassId)
            .collection('students').doc(studentId).delete();

        loadStudents(currentClassId);
        loadStats(user.uid);

        showToast('Siswa berhasil dihapus', 'success');
    } catch (error) {
        console.error('Error deleting student:', error);
        showToast('Gagal menghapus siswa', 'error');
    }
}

// Import from Google Spreadsheet
async function importFromSpreadsheet() {
    const url = document.getElementById('spreadsheetUrl').value.trim();
    if (!url) {
        showToast('Masukkan URL Google Spreadsheet', 'error');
        return;
    }

    // Extract spreadsheet ID from URL
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
        showToast('URL spreadsheet tidak valid', 'error');
        return;
    }

    const spreadsheetId = match[1];
    const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;

    showLoading('Mengimport data...');

    try {
        const response = await fetch(csvUrl);
        if (!response.ok) {
            throw new Error('Tidak dapat mengakses spreadsheet. Pastikan akses publik diaktifkan.');
        }

        const csvText = await response.text();
        const data = parseCSV(csvText);

        if (data.length < 2) {
            throw new Error('Data spreadsheet kosong atau format tidak sesuai');
        }

        const user = auth.currentUser;
        if (!user) return;

        // Skip header row
        const rows = data.slice(1);
        
        // Group by class
        const classeMap = {};
        rows.forEach(row => {
            if (row.length >= 2 && row[0] && row[1]) {
                const className = row[0].trim();
                if (!classeMap[className]) {
                    classeMap[className] = [];
                }
                classeMap[className].push({
                    name: row[1].trim(),
                    nis: row[2]?.trim() || '',
                    gender: row[3]?.trim().toUpperCase() || ''
                });
            }
        });

        // Import classes and students
        let totalClasses = 0;
        let totalStudents = 0;

        for (const [className, students] of Object.entries(classeMap)) {
            // Check if class exists
            const existingClass = await db.collection('users').doc(user.uid)
                .collection('classes')
                .where('name', '==', className)
                .get();

            let classId;
            if (existingClass.empty) {
                // Create new class
                const gradeMatch = className.match(/(\d+)/);
                const grade = gradeMatch ? parseInt(gradeMatch[1]) : 1;
                const fase = getFaseByGrade(grade);

                const classRef = await db.collection('users').doc(user.uid)
                    .collection('classes').add({
                        name: className,
                        grade: grade,
                        fase: fase?.id || null,
                        faseName: fase?.name || null,
                        homeroom: '',
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                classId = classRef.id;
                totalClasses++;
            } else {
                classId = existingClass.docs[0].id;
            }

            // Add students
            const batch = db.batch();
            students.forEach(student => {
                const studentRef = db.collection('users').doc(user.uid)
                    .collection('classes').doc(classId)
                    .collection('students').doc();
                batch.set(studentRef, {
                    ...student,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                totalStudents++;
            });
            await batch.commit();
        }

        hideLoading();
        loadClasses(user.uid);
        loadStats(user.uid);

        showToast(`Import berhasil! ${totalClasses} rombel baru, ${totalStudents} siswa.`, 'success');
        logActivity(`Import data dari spreadsheet: ${totalClasses} rombel, ${totalStudents} siswa`, 'file-import', 'green');

        document.getElementById('spreadsheetUrl').value = '';
    } catch (error) {
        console.error('Error importing from spreadsheet:', error);
        hideLoading();
        showToast(error.message || 'Gagal mengimport data', 'error');
    }
}

// Switch Tab
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });

    // Remove active state from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('border-primary', 'text-primary');
        btn.classList.add('border-transparent', 'text-gray-500');
    });

    // Show selected tab content
    document.getElementById(`content${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`).classList.remove('hidden');

    // Set active state on selected tab button
    const activeBtn = document.getElementById(`tab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
    activeBtn.classList.remove('border-transparent', 'text-gray-500');
    activeBtn.classList.add('border-primary', 'text-primary');
}

// Helper Functions
function showLoading(message = 'Memuat...') {
    const overlay = document.getElementById('loadingOverlay');
    const text = document.getElementById('loadingText');
    if (overlay) overlay.classList.remove('hidden');
    if (text) text.textContent = message;
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.classList.add('hidden');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    toast.innerHTML = `<i class="fas fa-${icons[type] || 'info-circle'} mr-2"></i>${message}`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
}

async function confirmDialog(message) {
    return confirm(message);
}

function getCurrentAcademicYear() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    return month >= 6 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
}

function getFaseByGrade(grade) {
    grade = parseInt(grade);
    if (grade >= 1 && grade <= 2) return { id: 'faseA', name: 'Fase A' };
    if (grade >= 3 && grade <= 4) return { id: 'faseB', name: 'Fase B' };
    if (grade >= 5 && grade <= 6) return { id: 'faseC', name: 'Fase C' };
    if (grade >= 7 && grade <= 9) return { id: 'faseD', name: 'Fase D' };
    if (grade === 10) return { id: 'faseE', name: 'Fase E' };
    if (grade >= 11 && grade <= 12) return { id: 'faseF', name: 'Fase F' };
    return null;
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const result = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());
        result.push(values);
    }
    
    return result;
}

async function logActivity(message, icon, color) {
    const user = auth.currentUser;
    if (!user) return;
    
    try {
        await db.collection('users').doc(user.uid)
            .collection('activities').add({
                message,
                icon,
                color,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
    } catch (error) {
        console.error('Error logging activity:', error);
    }
}

// Export functions
window.switchTab = switchTab;
window.showAddClassModal = showAddClassModal;
window.hideAddClassModal = hideAddClassModal;
window.deleteClass = deleteClass;
window.showStudents = showStudents;
window.hideStudentListModal = hideStudentListModal;
window.showAddStudentForm = showAddStudentForm;
window.hideAddStudentForm = hideAddStudentForm;
window.saveNewStudent = saveNewStudent;
window.deleteStudent = deleteStudent;
window.importFromSpreadsheet = importFromSpreadsheet;
window.toggleSidebar = toggleSidebar;