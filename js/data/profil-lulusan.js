/**
 * Delapan Dimensi Profil Lulusan
 * ADMIN PAI Super App
 */

const PROFIL_LULUSAN = {
    dimensions: [
        {
            id: 'keimanan',
            name: 'Keimanan dan Ketakwaan terhadap Tuhan YME',
            shortName: 'Keimanan & Ketakwaan',
            icon: 'fa-pray',
            color: 'primary',
            description: 'Memiliki keyakinan teguh, akhlak mulia, dan menghayati nilai spiritual dalam kehidupan sehari-hari.',
            indicators: [
                'Menjalankan ibadah sesuai ajaran agama',
                'Menunjukkan sikap jujur dan amanah',
                'Menghargai keragaman agama',
                'Mengamalkan nilai-nilai spiritual dalam kehidupan'
            ],
            keywords: ['iman', 'takwa', 'ibadah', 'akhlak', 'spiritual', 'religius']
        },
        {
            id: 'kewargaan',
            name: 'Kewargaan',
            shortName: 'Kewargaan',
            icon: 'fa-flag',
            color: 'blue',
            description: 'Menjadi warga negara yang bertanggung jawab, cinta tanah air, taat norma, serta peduli terhadap lingkungan dan sosial.',
            indicators: [
                'Memahami hak dan kewajiban sebagai warga negara',
                'Menunjukkan sikap cinta tanah air',
                'Berpartisipasi aktif dalam kegiatan sosial',
                'Menjaga kelestarian lingkungan'
            ],
            keywords: ['warga negara', 'nasionalisme', 'sosial', 'lingkungan', 'tanggung jawab']
        },
        {
            id: 'penalaran',
            name: 'Penalaran Kritis',
            shortName: 'Penalaran Kritis',
            icon: 'fa-brain',
            color: 'purple',
            description: 'Kemampuan menganalisis informasi secara objektif, mengevaluasi argumen, dan memecahkan masalah.',
            indicators: [
                'Menganalisis informasi dari berbagai sumber',
                'Membedakan fakta dan opini',
                'Mengambil keputusan berdasarkan data',
                'Menyelesaikan masalah secara sistematis'
            ],
            keywords: ['analisis', 'kritis', 'logika', 'pemecahan masalah', 'evaluasi']
        },
        {
            id: 'kreativitas',
            name: 'Kreativitas',
            shortName: 'Kreativitas',
            icon: 'fa-lightbulb',
            color: 'orange',
            description: 'Menghasilkan gagasan orisinal, inovatif, dan mampu beradaptasi dengan perubahan.',
            indicators: [
                'Menghasilkan ide-ide baru dan orisinal',
                'Menciptakan karya inovatif',
                'Berani mengambil risiko kreatif',
                'Adaptif terhadap perubahan'
            ],
            keywords: ['kreatif', 'inovatif', 'ide', 'karya', 'adaptasi']
        },
        {
            id: 'kolaborasi',
            name: 'Kolaborasi',
            shortName: 'Kolaborasi',
            icon: 'fa-users',
            color: 'green',
            description: 'Mampu bekerja sama, berinteraksi, dan berkontribusi secara efektif dalam berbagai situasi kelompok.',
            indicators: [
                'Bekerja sama dalam tim dengan baik',
                'Menghargai pendapat orang lain',
                'Berkontribusi positif dalam kelompok',
                'Menyelesaikan konflik secara konstruktif'
            ],
            keywords: ['kerja sama', 'tim', 'kelompok', 'gotong royong', 'sinergi']
        },
        {
            id: 'kemandirian',
            name: 'Kemandirian',
            shortName: 'Kemandirian',
            icon: 'fa-user-graduate',
            color: 'indigo',
            description: 'Bertanggung jawab atas proses dan hasil belajar, serta memiliki inisiatif.',
            indicators: [
                'Mengatur waktu belajar secara mandiri',
                'Menyelesaikan tugas tanpa bergantung orang lain',
                'Memiliki inisiatif dalam belajar',
                'Bertanggung jawab atas hasil belajar'
            ],
            keywords: ['mandiri', 'inisiatif', 'tanggung jawab', 'disiplin', 'percaya diri']
        },
        {
            id: 'kesehatan',
            name: 'Kesehatan',
            shortName: 'Kesehatan',
            icon: 'fa-heart',
            color: 'red',
            description: 'Menjaga keseimbangan kesehatan fisik dan mental (well-being).',
            indicators: [
                'Menjaga kesehatan fisik',
                'Mengelola emosi dengan baik',
                'Menerapkan pola hidup sehat',
                'Memiliki ketahanan mental'
            ],
            keywords: ['sehat', 'fisik', 'mental', 'well-being', 'kebugaran']
        },
        {
            id: 'komunikasi',
            name: 'Komunikasi',
            shortName: 'Komunikasi',
            icon: 'fa-comments',
            color: 'teal',
            description: 'Mampu menyampaikan ide dan informasi dengan jelas, baik lisan maupun tulisan, serta melakukan refleksi diri.',
            indicators: [
                'Menyampaikan ide secara jelas dan efektif',
                'Menulis dengan baik dan terstruktur',
                'Mendengarkan secara aktif',
                'Melakukan refleksi diri'
            ],
            keywords: ['komunikasi', 'presentasi', 'menulis', 'berbicara', 'refleksi']
        }
    ]
};

// Helper function to get dimension by id
function getDimensionById(id) {
    return PROFIL_LULUSAN.dimensions.find(d => d.id === id);
}

// Helper function to get all dimensions
function getAllDimensions() {
    return PROFIL_LULUSAN.dimensions;
}

// Helper function to match dimension by keyword
function matchDimensionByKeyword(text) {
    const matches = [];
    const lowerText = text.toLowerCase();
    
    PROFIL_LULUSAN.dimensions.forEach(dimension => {
        dimension.keywords.forEach(keyword => {
            if (lowerText.includes(keyword.toLowerCase())) {
                if (!matches.find(m => m.id === dimension.id)) {
                    matches.push(dimension);
                }
            }
        });
    });
    
    return matches;
}

// Export
window.PROFIL_LULUSAN = PROFIL_LULUSAN;
window.getDimensionById = getDimensionById;
window.getAllDimensions = getAllDimensions;
window.matchDimensionByKeyword = matchDimensionByKeyword;