// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Current User Data
let currentUser = null;
let userData = null;

// Toast Notification
function showToast(title, message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    const iconConfig = {
        success: { bg: 'bg-green-500', icon: 'fa-check' },
        error: { bg: 'bg-red-500', icon: 'fa-times' },
        warning: { bg: 'bg-yellow-500', icon: 'fa-exclamation' },
        info: { bg: 'bg-blue-500', icon: 'fa-info' }
    };

    const config = iconConfig[type] || iconConfig.success;
    toastIcon.className = `w-10 h-10 rounded-full flex items-center justify-center ${config.bg}`;
    toastIcon.innerHTML = `<i class="fas ${config.icon} text-white"></i>`;

    toast.classList.remove('translate-x-full');
    setTimeout(() => hideToast(), 4000);
}

function hideToast() {
    document.getElementById('toast').classList.add('translate-x-full');
}

// Loading Overlay
function showLoading(message = 'Memuat...') {
    const overlay = document.getElementById('loadingOverlay');
    overlay.querySelector('p').textContent = message;
    overlay.classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.add('hidden');
}

// Modal Functions
function showModal(content) {
    const container = document.getElementById('modalContainer');
    const contentDiv = document.getElementById('modalContent');
    contentDiv.innerHTML = content;
    container.classList.remove('hidden');
}

function hideModal() {
    document.getElementById('modalContainer').classList.add('hidden');
}

// Close modal on outside click
document.getElementById('modalContainer')?.addEventListener('click', (e) => {
    if (e.target.id === 'modalContainer') {
        hideModal();
    }
});

// Format Date
function formatDate(date, format = 'long') {
    const d = new Date(date);
    const options = {
        long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
        short: { year: 'numeric', month: 'short', day: 'numeric' },
        input: null // Will return YYYY-MM-DD
    };

    if (format === 'input') {
        return d.toISOString().split('T')[0];
    }

    return d.toLocaleDateString('id-ID', options[format] || options.long);
}

// Format Time
function formatTime(time) {
    return time.replace(':', '.');
}

// Generate Unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Check Premium Access
function isPremiumUser() {
    if (!userData) return false;
    if (userData.role === 'superadmin') return true;
    if (userData.subscription === 'premium' || userData.subscription === 'school') {
        if (userData.subscriptionExpiry) {
            return new Date(userData.subscriptionExpiry.toDate()) > new Date();
        }
    }
    return false;
}

// Check Super Admin
function isSuperAdmin() {
    return userData?.role === 'superadmin';
}

// Days of Week
const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

// Months
const MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// School Levels
const SCHOOL_LEVELS = {
    'SD': { phases: ['A', 'B', 'C'], grades: [1, 2, 3, 4, 5, 6] },
    'SMP': { phases: ['D'], grades: [7, 8, 9] },
    'SMA': { phases: ['E', 'F'], grades: [10, 11, 12] },
    'SMK': { phases: ['E', 'F'], grades: [10, 11, 12] }
};

// Get Phase by Grade
function getPhaseByGrade(grade) {
    grade = parseInt(grade);
    if (grade <= 2) return 'A';
    if (grade <= 4) return 'B';
    if (grade <= 6) return 'C';
    if (grade <= 9) return 'D';
    if (grade === 10) return 'E';
    return 'F';
}

// Calculate Effective Weeks
function calculateEffectiveWeeks(startDate, endDate, holidays = []) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let weeks = 0;
    let current = new Date(start);

    while (current <= end) {
        const isHoliday = holidays.some(h => 
            new Date(h.date).toDateString() === current.toDateString()
        );
        
        // Count Mondays that are not holidays
        if (current.getDay() === 1 && !isHoliday) {
            weeks++;
        }
        current.setDate(current.getDate() + 1);
    }

    return weeks;
}

// Validate Schedule Conflict
function hasScheduleConflict(schedules, newSchedule, excludeId = null) {
    return schedules.some(s => {
        if (excludeId && s.id === excludeId) return false;
        
        // Same day and time
        if (s.day === newSchedule.day && s.timeSlot === newSchedule.timeSlot) {
            // Same teacher in different class
            if (s.teacherId === newSchedule.teacherId && s.classId !== newSchedule.classId) {
                return true;
            }
            // Same class with different PAI teacher
            if (s.classId === newSchedule.classId && s.subject === 'PAI' && newSchedule.subject === 'PAI') {
                return true;
            }
        }
        return false;
    });
}

// Export to CSV
function exportToCSV(data, filename) {
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
}

// Parse CSV
function parseCSV(text) {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
        const values = line.match(/(".*?"|[^,]+)/g) || [];
        const obj = {};
        headers.forEach((h, i) => {
            obj[h] = (values[i] || '').replace(/"/g, '').trim();
        });
        return obj;
    });
}

// Fetch CSV from URL
async function fetchCSV(url) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        return parseCSV(text);
    } catch (error) {
        console.error('Error fetching CSV:', error);
        throw error;
    }
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Sanitize HTML
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Deep Clone
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Sleep Function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

console.log('Utils loaded successfully');