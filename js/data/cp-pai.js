// ==========================================
// DATA CAPAIAN PEMBELAJARAN PAI & BUDI PEKERTI
// Berdasarkan Kepka BSKAP No. 046/H/KR/2025
// ==========================================

const CP_PAI = {
    // 8 Dimensi Profil Pelajar Pancasila
    dimensi: [
        'Beriman dan Bertakwa kepada Tuhan YME',
        'Berkebinekaan Global',
        'Bernalar Kritis',
        'Kreatif',
        'Bergotong Royong',
        'Mandiri'
    ],

    // Elemen PAI
    elemen: [
        'Al-Quran dan Hadis',
        'Akidah',
        'Akhlak',
        'Fikih',
        'Sejarah Peradaban Islam'
    ],

    // Fase dan Capaian Pembelajaran
    fase: {
        A: {
            nama: 'Fase A',
            kelas: [1, 2],
            jenjang: 'SD/MI',
            capaian: [
                {
                    elemen: 'Al-Quran dan Hadis',
                    deskripsi: 'Peserta didik dapat mengenal huruf hijaiah, harakat, membaca dan menghafal surah-surah pendek, serta mengenal hadis tentang kasih sayang.',
                    tujuanPembelajaran: [
                        'Mengenal huruf hijaiah dan harakatnya',
                        'Membaca huruf hijaiah bersambung',
                        'Menghafal surah Al-Fatihah dengan baik dan benar',
                        'Menghafal surah An-Nas dengan baik dan benar',
                        'Menghafal surah Al-Falaq dengan baik dan benar',
                        'Menghafal surah Al-Ikhlas dengan baik dan benar',
                        'Memahami hadis tentang kasih sayang sesama'
                    ]
                },
                {
                    elemen: 'Akidah',
                    deskripsi: 'Peserta didik mengenal rukun iman, dua kalimat syahadat, dan Asmaul Husna.',
                    tujuanPembelajaran: [
                        'Mengenal enam rukun iman',
                        'Menghafalkan dua kalimat syahadat',
                        'Memahami makna dua kalimat syahadat',
                        'Mengenal Asmaul Husna: Ar-Rahman, Ar-Rahim, Al-Malik',
                        'Menyebutkan ciptaan Allah SWT di lingkungan sekitar'
                    ]
                },
                {
                    elemen: 'Akhlak',
                    deskripsi: 'Peserta didik menerapkan akhlak terpuji kepada diri sendiri dan sesama dalam kehidupan sehari-hari.',
                    tujuanPembelajaran: [
                        'Membiasakan berperilaku jujur',
                        'Membiasakan berperilaku disiplin',
                        'Membiasakan berperilaku tanggung jawab',
                        'Membiasakan mengucapkan dan menjawab salam',
                        'Membiasakan doa sebelum dan sesudah kegiatan',
                        'Menghormati orang tua dan guru'
                    ]
                },
                {
                    elemen: 'Fikih',
                    deskripsi: 'Peserta didik mengenal rukun Islam, tata cara bersuci, dan praktik salat.',
                    tujuanPembelajaran: [
                        'Menyebutkan lima rukun Islam',
                        'Mengenal pengertian bersuci (thaharah)',
                        'Mempraktikkan tata cara berwudu',
                        'Mengenal gerakan dan bacaan salat',
                        'Mempraktikkan salat dengan bimbingan'
                    ]
                },
                {
                    elemen: 'Sejarah Peradaban Islam',
                    deskripsi: 'Peserta didik mengenal kisah teladan Nabi Muhammad SAW dan para sahabat.',
                    tujuanPembelajaran: [
                        'Mengenal kisah kelahiran Nabi Muhammad SAW',
                        'Menceritakan masa kecil Nabi Muhammad SAW',
                        'Mengenal sifat-sifat terpuji Nabi Muhammad SAW',
                        'Meneladani sikap jujur (Ash-Shidiq) Nabi',
                        'Meneladani sikap amanah Nabi'
                    ]
                }
            ]
        },
        B: {
            nama: 'Fase B',
            kelas: [3, 4],
            jenjang: 'SD/MI',
            capaian: [
                {
                    elemen: 'Al-Quran dan Hadis',
                    deskripsi: 'Peserta didik dapat membaca Al-Quran dengan tartil, menghafal surah pendek, dan memahami hadis tentang kebersihan dan menuntut ilmu.',
                    tujuanPembelajaran: [
                        'Membaca Al-Quran dengan tartil',
                        'Menerapkan hukum bacaan tajwid dasar',
                        'Menghafal surah Al-Lahab',
                        'Menghafal surah An-Nasr',
                        'Menghafal surah Al-Kafirun',
                        'Memahami kandungan ayat tentang salat',
                        'Memahami hadis tentang kebersihan sebagian dari iman',
                        'Memahami hadis tentang menuntut ilmu'
                    ]
                },
                {
                    elemen: 'Akidah',
                    deskripsi: 'Peserta didik memahami sifat-sifat Allah, malaikat, dan kitab-kitab Allah.',
                    tujuanPembelajaran: [
                        'Memahami sifat wajib Allah SWT',
                        'Menyebutkan sifat mustahil Allah SWT',
                        'Mengenal sepuluh malaikat dan tugasnya',
                        'Meyakini keberadaan malaikat',
                        'Mengenal kitab-kitab Allah yang diturunkan',
                        'Meyakini Al-Quran sebagai kitab suci terakhir'
                    ]
                },
                {
                    elemen: 'Akhlak',
                    deskripsi: 'Peserta didik menerapkan adab kepada orang tua, guru, dan teman dalam kehidupan sehari-hari.',
                    tujuanPembelajaran: [
                        'Menerapkan adab kepada orang tua',
                        'Menerapkan adab kepada guru',
                        'Menerapkan adab kepada teman sebaya',
                        'Membiasakan sikap rendah hati (tawadhu)',
                        'Membiasakan sikap santun dalam berbicara',
                        'Menghindari perilaku sombong'
                    ]
                },
                {
                    elemen: 'Fikih',
                    deskripsi: 'Peserta didik memahami ketentuan puasa, zakat fitrah, dan mengenal masa balig.',
                    tujuanPembelajaran: [
                        'Memahami pengertian dan syarat puasa Ramadan',
                        'Mengenal hal-hal yang membatalkan puasa',
                        'Mempraktikkan puasa Ramadan',
                        'Memahami ketentuan zakat fitrah',
                        'Mengenal tanda-tanda masa balig',
                        'Memahami kewajiban setelah balig'
                    ]
                },
                {
                    elemen: 'Sejarah Peradaban Islam',
                    deskripsi: 'Peserta didik mengenal dakwah Nabi Muhammad SAW di Makkah.',
                    tujuanPembelajaran: [
                        'Menceritakan pengangkatan Muhammad sebagai Rasul',
                        'Menjelaskan dakwah Nabi secara sembunyi-sembunyi',
                        'Menjelaskan dakwah Nabi secara terang-terangan',
                        'Mengenal perjuangan para sahabat di Makkah',
                        'Meneladani ketabahan Nabi dalam berdakwah'
                    ]
                }
            ]
        },
        C: {
            nama: 'Fase C',
            kelas: [5, 6],
            jenjang: 'SD/MI',
            capaian: [
                {
                    elemen: 'Al-Quran dan Hadis',
                    deskripsi: 'Peserta didik dapat membaca Al-Quran dengan tajwid, memahami kandungan surah pendek, dan hadis tentang silaturahmi.',
                    tujuanPembelajaran: [
                        'Menerapkan hukum bacaan tajwid (Nun mati dan tanwin)',
                        'Menerapkan hukum bacaan Mad',
                        'Menghafal surah At-Tin',
                        'Menghafal surah Al-Insyirah',
                        'Memahami kandungan Q.S. Al-Hujurat: 13 tentang keberagaman',
                        'Memahami hadis tentang silaturahmi',
                        'Memahami hadis tentang menyayangi yang muda menghormati yang tua'
                    ]
                },
                {
                    elemen: 'Akidah',
                    deskripsi: 'Peserta didik memahami iman kepada rasul, hari akhir, dan qada qadar.',
                    tujuanPembelajaran: [
                        'Menyebutkan 25 nabi dan rasul',
                        'Memahami sifat-sifat rasul',
                        'Meyakini adanya hari akhir',
                        'Memahami tanda-tanda hari kiamat',
                        'Memahami qada dan qadar',
                        'Menerapkan sikap tawakal'
                    ]
                },
                {
                    elemen: 'Akhlak',
                    deskripsi: 'Peserta didik menerapkan adab sosial dan menghargai keberagaman.',
                    tujuanPembelajaran: [
                        'Menghargai perbedaan pendapat',
                        'Menerapkan sikap toleransi',
                        'Membiasakan tolong-menolong',
                        'Menghindari perkataan kotor dan kasar',
                        'Membiasakan sikap dermawan',
                        'Menjaga lingkungan sekitar'
                    ]
                },
                {
                    elemen: 'Fikih',
                    deskripsi: 'Peserta didik memahami ketentuan zakat mal, infak, sedekah, dan makanan halal haram.',
                    tujuanPembelajaran: [
                        'Memahami pengertian zakat mal',
                        'Menjelaskan perbedaan infak dan sedekah',
                        'Mempraktikkan infak dan sedekah',
                        'Menjelaskan kriteria makanan halal',
                        'Menjelaskan kriteria makanan haram',
                        'Membiasakan mengonsumsi makanan halal'
                    ]
                },
                {
                    elemen: 'Sejarah Peradaban Islam',
                    deskripsi: 'Peserta didik mengenal hijrah dan peradaban Islam di Madinah.',
                    tujuanPembelajaran: [
                        'Menceritakan peristiwa hijrah ke Madinah',
                        'Menjelaskan piagam Madinah',
                        'Mengenal persaudaraan Muhajirin dan Anshar',
                        'Meneladani semangat hijrah',
                        'Mengenal perkembangan Islam di Madinah'
                    ]
                }
            ]
        },
        D: {
            nama: 'Fase D',
            kelas: [7, 8, 9],
            jenjang: 'SMP/MTs',
            capaian: [
                {
                    elemen: 'Al-Quran dan Hadis',
                    deskripsi: 'Peserta didik dapat membaca Al-Quran dengan tajwid yang benar, memahami ayat-ayat pilihan, dan hadis tentang toleransi.',
                    tujuanPembelajaran: [
                        'Menerapkan hukum tajwid secara lengkap',
                        'Memahami Q.S. Al-Kafirun tentang toleransi',
                        'Memahami Q.S. Yunus: 40-41 tentang toleransi',
                        'Memahami Q.S. Al-Baqarah: 256 tentang tidak ada paksaan dalam agama',
                        'Menghafal Q.S. Ar-Rahman: 1-13',
                        'Memahami hadis tentang menghormati tetangga',
                        'Memahami hadis tentang toleransi beragama'
                    ]
                },
                {
                    elemen: 'Akidah',
                    deskripsi: 'Peserta didik memahami rukun iman secara mendalam dan menghayati keagungan Allah.',
                    tujuanPembelajaran: [
                        'Menganalisis bukti keesaan Allah',
                        'Memahami makna iman kepada malaikat',
                        'Menganalisis fungsi iman kepada kitab',
                        'Memahami makna iman kepada rasul secara mendalam',
                        'Menganalisis hikmah iman kepada hari akhir',
                        'Menganalisis makna iman kepada qada qadar'
                    ]
                },
                {
                    elemen: 'Akhlak',
                    deskripsi: 'Peserta didik menerapkan akhlak mulia dan menghindari akhlak tercela.',
                    tujuanPembelajaran: [
                        'Membiasakan sikap ikhlas dan sabar',
                        'Menghindari sikap riya dan nifaq',
                        'Menerapkan sikap husnuzan',
                        'Menghindari sikap suuzan, hasad, dan ghibah',
                        'Menerapkan adab berpakaian Islami',
                        'Menerapkan adab bergaul dengan lawan jenis'
                    ]
                },
                {
                    elemen: 'Fikih',
                    deskripsi: 'Peserta didik memahami ketentuan sujud, haji, umrah, dan muamalah.',
                    tujuanPembelajaran: [
                        'Mempraktikkan sujud syukur dan tilawah',
                        'Memahami ketentuan haji dan umrah',
                        'Menjelaskan rukun dan wajib haji',
                        'Memahami jual beli yang halal',
                        'Memahami riba dan bahayanya',
                        'Mengenal perbankan syariah'
                    ]
                },
                {
                    elemen: 'Sejarah Peradaban Islam',
                    deskripsi: 'Peserta didik memahami peradaban Islam masa Bani Umayyah hingga Mughal.',
                    tujuanPembelajaran: [
                        'Menganalisis peradaban Bani Umayyah',
                        'Menganalisis peradaban Bani Abbasiyah',
                        'Menganalisis perkembangan Islam di Andalusia',
                        'Mengenal tokoh-tokoh ilmuwan Muslim',
                        'Menganalisis peradaban Islam di Asia (Mughal, Turki Utsmani)',
                        'Meneladani semangat ilmuwan Muslim'
                    ]
                }
            ]
        },
        E: {
            nama: 'Fase E',
            kelas: [10],
            jenjang: 'SMA/MA/SMK',
            capaian: [
                {
                    elemen: 'Al-Quran dan Hadis',
                    deskripsi: 'Peserta didik dapat menganalisis dan menghayati ayat-ayat Al-Quran tentang kompetisi dalam kebaikan.',
                    tujuanPembelajaran: [
                        'Menganalisis Q.S. Al-Maidah: 48 tentang berlomba dalam kebaikan',
                        'Memahami Q.S. An-Nisa: 59 tentang taat kepada pemimpin',
                        'Menghafal Q.S. Al-Maidah: 48 dan Al-Hujurat: 10',
                        'Menganalisis hadis tentang menjaga lisan dan tangan',
                        'Menganalisis hadis tentang persaudaraan'
                    ]
                },
                {
                    elemen: 'Akidah',
                    deskripsi: 'Peserta didik memahami Syuab al-Iman dan implementasinya.',
                    tujuanPembelajaran: [
                        'Menganalisis cabang-cabang iman (Syuab al-Iman)',
                        'Memahami implementasi iman dalam kehidupan',
                        'Menganalisis hubungan iman dengan amal saleh',
                        'Memahami konsep mukmin, muslim, dan muhsin'
                    ]
                },
                {
                    elemen: 'Akhlak',
                    deskripsi: 'Peserta didik menerapkan etika dalam media sosial dan kehidupan digital.',
                    tujuanPembelajaran: [
                        'Menerapkan etika bermedia sosial',
                        'Memahami bahaya hoax dan ujaran kebencian',
                        'Menerapkan sikap kritis terhadap informasi',
                        'Memahami adab berkomunikasi digital',
                        'Menyebarkan konten positif'
                    ]
                },
                {
                    elemen: 'Fikih',
                    deskripsi: 'Peserta didik memahami sumber hukum Islam dan kontekstualisasinya.',
                    tujuanPembelajaran: [
                        'Menganalisis Al-Quran sebagai sumber hukum',
                        'Menganalisis Hadis sebagai sumber hukum',
                        'Memahami ijtihad dan bentuknya',
                        'Menganalisis hukum Islam kontemporer'
                    ]
                },
                {
                    elemen: 'Sejarah Peradaban Islam',
                    deskripsi: 'Peserta didik menganalisis masuk dan berkembangnya Islam di Indonesia.',
                    tujuanPembelajaran: [
                        'Menganalisis teori masuknya Islam ke Indonesia',
                        'Menjelaskan peran kerajaan Islam di Indonesia',
                        'Menganalisis peran Walisongo',
                        'Menganalisis perkembangan Islam Nusantara',
                        'Memahami karakteristik Islam Indonesia'
                    ]
                }
            ]
        },
        F: {
            nama: 'Fase F',
            kelas: [11, 12],
            jenjang: 'SMA/MA/SMK',
            capaian: [
                {
                    elemen: 'Al-Quran dan Hadis',
                    deskripsi: 'Peserta didik dapat menganalisis dan mengkritisi pemahaman ayat Al-Quran secara kontekstual.',
                    tujuanPembelajaran: [
                        'Menganalisis Q.S. Al-Isra: 32 tentang larangan zina',
                        'Menganalisis Q.S. An-Nur: 2 tentang hukum zina',
                        'Menganalisis Q.S. An-Nisa: 9 tentang masa depan generasi',
                        'Menganalisis metode memahami Al-Quran kontekstual',
                        'Menganalisis hadis tentang mencegah kemungkaran'
                    ]
                },
                {
                    elemen: 'Akidah',
                    deskripsi: 'Peserta didik menganalisis aliran-aliran dalam Islam dan moderasi beragama.',
                    tujuanPembelajaran: [
                        'Menganalisis perbedaan aliran dalam Islam',
                        'Memahami prinsip moderasi beragama',
                        'Mengkritisi sikap ekstremisme',
                        'Menerapkan sikap moderat dalam beragama'
                    ]
                },
                {
                    elemen: 'Akhlak',
                    deskripsi: 'Peserta didik menerapkan akhlak dalam pergaulan dan persiapan berkeluarga.',
                    tujuanPembelajaran: [
                        'Memahami etika pergaulan remaja',
                        'Memahami persiapan menuju pernikahan',
                        'Menganalisis bahaya pergaulan bebas',
                        'Menerapkan akhlak dalam kehidupan bermasyarakat'
                    ]
                },
                {
                    elemen: 'Fikih',
                    deskripsi: 'Peserta didik memahami hukum keluarga, waris, dan ekonomi Islam.',
                    tujuanPembelajaran: [
                        'Menganalisis ketentuan pernikahan dalam Islam',
                        'Memahami hak dan kewajiban suami istri',
                        'Menganalisis ketentuan mawaris (waris)',
                        'Menghitung pembagian waris',
                        'Menganalisis prinsip ekonomi Islam',
                        'Memahami wakaf dan pengelolaannya'
                    ]
                },
                {
                    elemen: 'Sejarah Peradaban Islam',
                    deskripsi: 'Peserta didik menganalisis organisasi Islam dan perkembangan Islam modern.',
                    tujuanPembelajaran: [
                        'Menganalisis organisasi Islam di Indonesia (NU, Muhammadiyah, dll)',
                        'Menganalisis organisasi Islam dunia (OKI, Liga Arab)',
                        'Memahami tantangan umat Islam kontemporer',
                        'Menganalisis peran pemuda dalam kemajuan Islam'
                    ]
                }
            ]
        }
    }
};

// Helper Functions
function getCPByPhase(phase) {
    return CP_PAI.fase[phase] || null;
}

function getTPByPhaseAndElement(phase, element) {
    const cp = CP_PAI.fase[phase];
    if (!cp) return [];
    
    const elemen = cp.capaian.find(c => c.elemen === element);
    return elemen ? elemen.tujuanPembelajaran : [];
}

function getAllElements() {
    return CP_PAI.elemen;
}

function getAllPhases() {
    return Object.keys(CP_PAI.fase);
}

function getPhaseByGrade(grade) {
    grade = parseInt(grade);
    if (grade <= 2) return 'A';
    if (grade <= 4) return 'B';
    if (grade <= 6) return 'C';
    if (grade <= 9) return 'D';
    if (grade === 10) return 'E';
    return 'F';
}

console.log('✅ CP PAI data loaded successfully');
