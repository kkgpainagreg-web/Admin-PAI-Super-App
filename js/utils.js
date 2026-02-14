// ==========================================
// UTILITY FUNCTIONS - COMPLETE VERSION
// ==========================================

// Current User Data
let currentUser = null;
let userData = null;

// ==========================================
// TOAST NOTIFICATION
// ==========================================

function showToast(title, message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    const toastIcon = document.getElementById('toastIcon');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');

    if (toastTitle) toastTitle.textContent = title;
    if (toastMessage) toastMessage.textContent = message;

    const iconConfig = {
        success: { bg: 'bg-green-500', icon: 'fa-check' },
        error: { bg: 'bg-red-500', icon: 'fa-times' },
        warning: { bg: 'bg-yellow-500', icon: 'fa-exclamation' },
        info: { bg: 'bg-blue-500', icon: 'fa-info' }
    };

    const config = iconConfig[type] || iconConfig.success;
    if (toastIcon) {
        toastIcon.className = `w-10 h-10 rounded-full flex items-center justify-center ${config.bg}`;
        toastIcon.innerHTML = `<i class="fas ${config.icon} text-white"></i>`;
    }

    toast.classList.remove('translate-x-full');
    setTimeout(() => hideToast(), 4000);
}

function hideToast() {
    const toast = document.getElementById('toast');
    if (toast) toast.classList.add('translate-x-full');
}

// ==========================================
// LOADING OVERLAY
// ==========================================

function showLoading(message = 'Memuat...') {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        const text = overlay.querySelector('p');
        if (text) text.textContent = message;
        overlay.classList.remove('hidden');
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.classList.add('hidden');
}

// ==========================================
// MODAL FUNCTIONS
// ==========================================

function showModal(content) {
    const container = document.getElementById('modalContainer');
    const contentDiv = document.getElementById('modalContent');
    if (container && contentDiv) {
        contentDiv.innerHTML = content;
        container.classList.remove('hidden');
    }
}

function hideModal() {
    const container = document.getElementById('modalContainer');
    if (container) container.classList.add('hidden');
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    if (e.target.id === 'modalContainer') {
        hideModal();
    }
});

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideModal();
    }
});

// ==========================================
// DATE FORMATTING
// ==========================================

function formatDate(date, format = 'long') {
    if (!date) return '-';
    
    let d;
    if (typeof date === 'string') {
        d = new Date(date);
    } else if (date.toDate && typeof date.toDate === 'function') {
        d = date.toDate();
    } else if (date instanceof Date) {
        d = date;
    } else {
        d = new Date(date);
    }
    
    if (isNaN(d.getTime())) return '-';

    if (format === 'input') {
        return d.toISOString().split('T')[0];
    }

    const options = {
        long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
        short: { day: 'numeric', month: 'short', year: 'numeric' },
        medium: { day: 'numeric', month: 'long', year: 'numeric' }
    };

    return d.toLocaleDateString('id-ID', options[format] || options.long);
}

function formatTime(time) {
    if (!time) return '-';
    return time.replace(':', '.');
}

// ==========================================
// ID GENERATOR
// ==========================================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ==========================================
// SUBSCRIPTION CHECK
// ==========================================

function isPremiumUser() {
    if (!userData) return false;
    if (userData.role === 'superadmin') return true;
    if (userData.subscription === 'premium' || userData.subscription === 'school') {
        if (userData.subscriptionExpiry) {
            const expiry = userData.subscriptionExpiry.toDate ? 
                          userData.subscriptionExpiry.toDate() : 
                          new Date(userData.subscriptionExpiry);
            return expiry > new Date();
        }
        return true;
    }
    return false;
}

function isSuperAdmin() {
    return userData?.role === 'superadmin';
}

// ==========================================
// CONSTANTS
// ==========================================

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const SCHOOL_LEVELS = {
    'SD': { phases: ['A', 'B', 'C'], grades: [1, 2, 3, 4, 5, 6] },
    'SMP': { phases: ['D'], grades: [7, 8, 9] },
    'SMA': { phases: ['E', 'F'], grades: [10, 11, 12] },
    'SMK': { phases: ['E', 'F'], grades: [10, 11, 12] }
};

// ==========================================
// PHASE BY GRADE
// ==========================================

function getPhaseByGrade(grade) {
    grade = parseInt(grade);
    if (grade <= 2) return 'A';
    if (grade <= 4) return 'B';
    if (grade <= 6) return 'C';
    if (grade <= 9) return 'D';
    if (grade === 10) return 'E';
    return 'F';
}

// ==========================================
// EFFECTIVE WEEKS CALCULATION
// ==========================================

function calculateEffectiveWeeks(startDate, endDate, holidays = []) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let weeks = 0;
    let current = new Date(start);

    while (current <= end) {
        const dateStr = current.toISOString().split('T')[0];
        const isHoliday = holidays.some(h => h.date === dateStr);
        
        // Count Mondays that are not holidays
        if (current.getDay() === 1 && !isHoliday) {
            weeks++;
        }
        current.setDate(current.getDate() + 1);
    }

    return weeks;
}

// ==========================================
// CSV FUNCTIONS
// ==========================================

function exportToCSV(data, filename) {
    if (!data || data.length === 0) {
        showToast('Info', 'Tidak ada data untuk diexport', 'info');
        return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(h => {
            let val = row[h] || '';
            if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
                val = '"' + val.replace(/"/g, '""') + '"';
            }
            return val;
        }).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Berhasil!', 'File berhasil diexport', 'success');
}

function parseCSV(text) {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];
    
    // Parse headers
    const headers = parseCSVLine(lines[0]);
    
    // Parse data rows
    return lines.slice(1).map(line => {
        const values = parseCSVLine(line);
        const obj = {};
        headers.forEach((h, i) => {
            obj[h.trim()] = (values[i] || '').trim();
        });
        return obj;
    });
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    
    return result;
}

async function fetchCSV(url) {
    try {
        // Handle Google Sheets URL
        if (url.includes('docs.google.com/spreadsheets')) {
            // Convert to export URL if needed
            if (!url.includes('/pub?')) {
                const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
                if (match) {
                    url = `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv`;
                }
            }
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch CSV');
        
        const text = await response.text();
        return parseCSV(text);
    } catch (error) {
        console.error('Error fetching CSV:', error);
        throw error;
    }
}

// ==========================================
// DEBOUNCE FUNCTION
// ==========================================

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

// ==========================================
// SANITIZE HTML
// ==========================================

function sanitizeHTML(str) {
    if (!str) return '';
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// ==========================================
// DEEP CLONE
// ==========================================

function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// ==========================================
// SLEEP FUNCTION
// ==========================================

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ==========================================
// NUMBER FORMATTING
// ==========================================

function formatNumber(num) {
    if (num === null || num === undefined) return '-';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatCurrency(num) {
    if (num === null || num === undefined) return '-';
    return 'Rp ' + formatNumber(num);
}

// ==========================================
// VALIDATION
// ==========================================

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidPhone(phone) {
    const re = /^[0-9]{10,15}$/;
    return re.test(phone.replace(/\D/g, ''));
}

// ==========================================
// LOCAL STORAGE HELPERS
// ==========================================

function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

function getLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return defaultValue;
    }
}

function removeLocalStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        console.error('Error removing from localStorage:', e);
    }
}

console.log('✅ Utils loaded successfully');
