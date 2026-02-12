// ==========================================
// DATA CAPAIAN PEMBELAJARAN PAI
// Berdasarkan Kepka BSKAP No. 046/H/KR/2025
// ==========================================

// 8 Dimensi Profil Lulusan
const DIMENSI_PROFIL_LULUSAN = [
    {
        id: "keimanan",
        nama: "Keimanan dan Ketakwaan terhadap Tuhan YME",
        deskripsi: "Memiliki keyakinan teguh, akhlak mulia, dan menghayati nilai spiritual dalam kehidupan sehari-hari.",
        icon: "fa-pray",
        color: "from-green-500 to-emerald-600",
        indikator: [
            "Meyakini keberadaan dan keesaan Allah SWT",
            "Melaksanakan ibadah dengan istiqamah",
            "Menunjukkan akhlak mulia dalam kehidupan",
            "Menghayati nilai-nilai spiritual",
            "Bersyukur atas nikmat Allah SWT"
        ]
    },
    {
        id: "kewargaan",
        nama: "Kewargaan",
        deskripsi: "Menjadi warga negara yang bertanggung jawab, cinta tanah air, taat norma, serta peduli terhadap lingkungan dan sosial.",
        icon: "fa-flag",
        color: "from-red-500 to-rose-600",
        indikator: [
            "Cinta tanah air dan bangsa",
            "Taat terhadap norma dan aturan",
            "Bertanggung jawab sebagai warga negara",
            "Peduli terhadap lingkungan",
            "Aktif dalam kegiatan sosial kemasyarakatan"
        ]
    },
    {
        id: "penalaran",
        nama: "Penalaran Kritis",
        deskripsi: "Kemampuan menganalisis informasi secara objektif, mengevaluasi argumen, dan memecahkan masalah.",
        icon: "fa-brain",
        color: "from-purple-500 to-violet-600",
        indikator: [
            "Menganalisis informasi secara objektif",
            "Mengevaluasi argumen dan bukti",
            "Memecahkan masalah dengan sistematis",
            "Mengambil keputusan berdasarkan data",
            "Berpikir logis dan rasional"
        ]
    },
    {
        id: "kreativitas",
        nama: "Kreativitas",
        deskripsi: "Menghasilkan gagasan orisinal, inovatif, dan mampu beradaptasi dengan perubahan.",
        icon: "fa-lightbulb",
        color: "from-yellow-500 to-amber-600",
        indikator: [
            "Menghasilkan ide-ide orisinal",
            "Berinovasi dalam menyelesaikan masalah",
            "Beradaptasi dengan perubahan",
            "Mengeksplorasi berbagai kemungkinan",
            "Mengembangkan karya yang bermakna"
        ]
    },
    {
        id: "kolaborasi",
        nama: "Kolaborasi",
        deskripsi: "Mampu bekerja sama, berinteraksi, dan berkontribusi secara efektif dalam berbagai situasi kelompok.",
        icon: "fa-users",
        color: "from-blue-500 to-indigo-600",
        indikator: [
            "Bekerja sama dalam tim",
            "Menghargai pendapat orang lain",
            "Berkontribusi aktif dalam kelompok",
            "Membangun hubungan yang positif",
            "Menyelesaikan konflik secara konstruktif"
        ]
    },
    {
        id: "kemandirian",
        nama: "Kemandirian",
        deskripsi: "Bertanggung jawab atas proses dan hasil belajar, serta memiliki inisiatif.",
        icon: "fa-user-check",
        color: "from-teal-500 to-cyan-600",
        indikator: [
            "Bertanggung jawab atas tindakan sendiri",
            "Memiliki inisiatif dalam belajar",
            "Mengatur waktu dan sumber daya",
            "Mengambil keputusan secara mandiri",
            "Gigih dalam mencapai tujuan"
        ]
    },
    {
        id: "kesehatan",
        nama: "Kesehatan",
        deskripsi: "Menjaga keseimbangan kesehatan fisik dan mental (well-being).",
        icon: "fa-heart",
        color: "from-pink-500 to-rose-600",
        indikator: [
            "Menjaga kesehatan fisik",
            "Menjaga kesehatan mental",
            "Mengelola emosi dengan baik",
            "Menerapkan pola hidup sehat",
            "Menjaga keseimbangan hidup (well-being)"
        ]
    },
    {
        id: "komunikasi",
        nama: "Komunikasi",
        deskripsi: "Mampu menyampaikan ide dan informasi dengan jelas, baik lisan maupun tulisan, serta melakukan refleksi diri.",
        icon: "fa-comments",
        color: "from-orange-500 to-red-600",
        indikator: [
            "Menyampaikan ide dengan jelas",
            "Berkomunikasi secara lisan dengan baik",
            "Menulis dengan efektif",
            "Mendengarkan secara aktif",
            "Melakukan refleksi diri"
        ]
    }
];

// Data Capaian Pembelajaran PAI per Fase
const DATA_CP = {
    "A": {
        fase: "Fase A",
        kelas: "Kelas 1-2",
        deskripsi: "Pada akhir Fase A, peserta didik mampu mengenal rukun iman dan rukun Islam, mengenal sifat-sifat Allah dan Rasul-Nya, melaksanakan salat dan berdoa dengan bimbingan, serta menunjukkan akhlak mulia dalam kehidupan sehari-hari.",
        elemen: [
            {
                nama: "Al-Qur'an dan Hadis",
                cp: "Peserta didik mampu membaca surah-surah pendek dalam Al-Qur'an (Al-Fatihah, An-Nas, Al-Falaq, Al-Ikhlas) dengan bimbingan, menghafal surah-surah pendek, dan memahami pesan-pesan pokok yang terkandung di dalamnya.",
                materi: [
                    "Surah Al-Fatihah",
                    "Surah An-Nas",
                    "Surah Al-Falaq", 
                    "Surah Al-Ikhlas",
                    "Huruf Hijaiyah",
                    "Tanda baca Al-Qur'an dasar"
                ]
            },
            {
                nama: "Akidah",
                cp: "Peserta didik mampu mengenal rukun iman, meyakini Allah sebagai Tuhan Yang Maha Esa, mengenal sifat-sifat Allah (Asmaul Husna dasar), dan mengenal para Nabi dan Rasul.",
                materi: [
                    "Rukun Iman",
                    "Dua kalimat syahadat",
                    "Mengenal Allah SWT",
                    "Asmaul Husna (Ar-Rahman, Ar-Rahim, Al-Malik)",
                    "Kisah Nabi Adam AS",
                    "Kisah Nabi Nuh AS"
                ]
            },
            {
                nama: "Akhlak",
                cp: "Peserta didik mampu menerapkan akhlak terpuji dalam kehidupan sehari-hari seperti jujur, disiplin, tanggung jawab, santun, peduli, percaya diri, serta menghindari akhlak tercela.",
                materi: [
                    "Berperilaku jujur",
                    "Disiplin dalam beribadah",
                    "Kasih sayang sesama",
                    "Hormat kepada orang tua dan guru",
                    "Tolong menolong",
                    "Menjaga kebersihan"
                ]
            },
            {
                nama: "Fikih",
                cp: "Peserta didik mampu mengenal tata cara bersuci (thaharah), mengenal rukun Islam, dan melaksanakan salat fardu dengan bimbingan.",
                materi: [
                    "Rukun Islam",
                    "Tata cara bersuci (wudu)",
                    "Mengenal najis dan cara membersihkannya",
                    "Praktik salat dengan bimbingan",
                    "Doa sehari-hari",
                    "Adab makan dan minum"
                ]
            },
            {
                nama: "Sejarah Peradaban Islam",
                cp: "Peserta didik mampu mengenal kisah-kisah teladan Nabi Muhammad SAW dan para sahabat dalam kehidupan sehari-hari.",
                materi: [
                    "Kisah kelahiran Nabi Muhammad SAW",
                    "Masa kecil Nabi Muhammad SAW",
                    "Sifat-sifat Nabi Muhammad SAW",
                    "Kisah sahabat Nabi (Abu Bakar, Umar)"
                ]
            }
        ],
        dimensiProfil: [
            {
                dimensi: "keimanan",
                deskripsi: "Mengenal dan meyakini Allah SWT serta melaksanakan ibadah dasar dengan bimbingan"
            },
            {
                dimensi: "kewargaan",
                deskripsi: "Mengenal aturan di rumah dan sekolah serta peduli terhadap teman"
            },
            {
                dimensi: "penalaran",
                deskripsi: "Mengenal perbedaan baik dan buruk dalam kehidupan sehari-hari"
            },
            {
                dimensi: "kreativitas",
                deskripsi: "Mengekspresikan pembelajaran melalui gambar, nyanyian, dan gerakan"
            },
            {
                dimensi: "kolaborasi",
                deskripsi: "Bermain dan belajar bersama teman dengan sikap yang baik"
            },
            {
                dimensi: "kemandirian",
                deskripsi: "Melaksanakan tugas sederhana secara mandiri dengan bimbingan"
            },
            {
                dimensi: "kesehatan",
                deskripsi: "Mengenal dan mempraktikkan kebersihan diri dan lingkungan"
            },
            {
                dimensi: "komunikasi",
                deskripsi: "Menyampaikan perasaan dan pengalaman dengan bahasa sederhana"
            }
        ]
    },
    "B": {
        fase: "Fase B",
        kelas: "Kelas 3-4",
        deskripsi: "Pada akhir Fase B, peserta didik mampu membaca Al-Qur'an dengan tartil, memahami kandungan surah-surah pendek, melaksanakan ibadah dengan mandiri, memahami hikmah ibadah, dan menunjukkan sikap toleransi dalam kehidupan bermasyarakat.",
        elemen: [
            {
                nama: "Al-Qur'an dan Hadis",
                cp: "Peserta didik mampu membaca Al-Qur'an dengan tartil sesuai kaidah tajwid dasar, menghafal surah-surah pendek (Juz 30), memahami kandungan ayat secara sederhana, dan mengenal hadis-hadis pilihan.",
                materi: [
                    "Surah Al-Kafirun",
                    "Surah Al-Ma'un",
                    "Surah At-Takatsur",
                    "Surah Al-Qari'ah",
                    "Hukum bacaan tajwid dasar",
                    "Hadis tentang kebersihan",
                    "Hadis tentang kasih sayang"
                ]
            },
            {
                nama: "Akidah",
                cp: "Peserta didik mampu memahami dan meyakini rukun iman secara lebih mendalam, mengenal Asmaul Husna dan mengamalkannya, serta memahami hikmah beriman kepada Allah, malaikat, kitab, dan rasul.",
                materi: [
                    "Iman kepada Allah dan sifat-sifat-Nya",
                    "Iman kepada Malaikat Allah",
                    "Iman kepada Kitab-kitab Allah",
                    "Iman kepada Rasul-rasul Allah",
                    "Asmaul Husna (10 nama)",
                    "Kisah Nabi Ibrahim AS",
                    "Kisah Nabi Musa AS"
                ]
            },
            {
                nama: "Akhlak",
                cp: "Peserta didik mampu memahami dan menerapkan akhlak terpuji seperti rendah hati, santun, hemat, dan qanaah; serta memahami dampak buruk akhlak tercela seperti sombong, kikir, dan tamak.",
                materi: [
                    "Rendah hati (tawadhu)",
                    "Santun dalam bertutur kata",
                    "Hemat dan tidak boros",
                    "Qanaah (merasa cukup)",
                    "Menghindari sifat sombong",
                    "Menghindari sifat kikir",
                    "Toleransi antar sesama"
                ]
            },
            {
                nama: "Fikih",
                cp: "Peserta didik mampu melaksanakan salat fardu dan sunah dengan benar, memahami ketentuan puasa Ramadan, mengenal zakat, dan memahami adab-adab dalam beribadah.",
                materi: [
                    "Salat fardu lima waktu",
                    "Salat sunah rawatib",
                    "Puasa Ramadan",
                    "Zakat fitrah",
                    "Sedekah dan infak",
                    "Adab di masjid",
                    "Adab terhadap Al-Qur'an"
                ]
            },
            {
                nama: "Sejarah Peradaban Islam",
                cp: "Peserta didik mampu memahami perjuangan Nabi Muhammad SAW dalam menyebarkan Islam di Makkah dan Madinah, serta meneladani sikap dan perjuangan para sahabat.",
                materi: [
                    "Dakwah Nabi di Makkah",
                    "Hijrah ke Madinah",
                    "Perjanjian Hudaibiyah",
                    "Fathu Makkah",
                    "Kisah Khadijah RA",
                    "Kisah Bilal bin Rabah"
                ]
            }
        ],
        dimensiProfil: [
            {
                dimensi: "keimanan",
                deskripsi: "Memahami rukun iman secara lebih mendalam dan melaksanakan ibadah dengan mandiri"
            },
            {
                dimensi: "kewargaan",
                deskripsi: "Menunjukkan sikap toleransi dan menghargai perbedaan di lingkungan sekitar"
            },
            {
                dimensi: "penalaran",
                deskripsi: "Menganalisis hikmah di balik perintah dan larangan dalam agama"
            },
            {
                dimensi: "kreativitas",
                deskripsi: "Mengembangkan cara-cara kreatif dalam mempelajari dan mengamalkan ajaran Islam"
            },
            {
                dimensi: "kolaborasi",
                deskripsi: "Bekerja sama dalam kegiatan keagamaan dan sosial di sekolah dan masyarakat"
            },
            {
                dimensi: "kemandirian",
                deskripsi: "Melaksanakan ibadah dan tugas keagamaan secara mandiri"
            },
            {
                dimensi: "kesehatan",
                deskripsi: "Memahami hubungan antara kebersihan, kesehatan, dan ajaran Islam"
            },
            {
                dimensi: "komunikasi",
                deskripsi: "Menyampaikan pemahaman keagamaan dan berdiskusi dengan sopan"
            }
        ]
    },
    "C": {
        fase: "Fase C",
        kelas: "Kelas 5-6",
        deskripsi: "Pada akhir Fase C, peserta didik mampu membaca Al-Qur'an dengan lancar dan tartil, memahami kandungan ayat dan hadis serta mengamalkannya, melaksanakan ibadah dengan penuh kesadaran, memahami sejarah peradaban Islam, dan menunjukkan sikap moderat dalam kehidupan berbangsa.",
        elemen: [
            {
                nama: "Al-Qur'an dan Hadis",
                cp: "Peserta didik mampu membaca Al-Qur'an dengan lancar sesuai kaidah tajwid, menghafal surah-surah dalam Juz 30, memahami kandungan ayat dan mengamalkannya, serta memahami dan mengamalkan hadis-hadis pilihan.",
                materi: [
                    "Surah Al-Hujurat ayat 13",
                    "Surah Luqman ayat 13-14",
                    "Surah Al-Mujadalah ayat 11",
                    "Surah Ar-Rahman ayat 33",
                    "Tajwid lengkap (nun mati, mim mati, mad)",
                    "Hadis tentang menuntut ilmu",
                    "Hadis tentang persaudaraan",
                    "Hadis tentang akhlak mulia"
                ]
            },
            {
                nama: "Akidah",
                cp: "Peserta didik mampu memahami dan meyakini rukun iman secara komprehensif, memahami takdir Allah, kehidupan akhirat, serta mengamalkan Asmaul Husna dalam kehidupan.",
                materi: [
                    "Iman kepada Hari Akhir",
                    "Iman kepada Qada dan Qadar",
                    "Tanda-tanda hari kiamat",
                    "Kehidupan di alam barzakh",
                    "Surga dan neraka",
                    "Asmaul Husna (20 nama)",
                    "Kisah Nabi Isa AS",
                    "Kisah Nabi Muhammad SAW lengkap"
                ]
            },
            {
                nama: "Akhlak",
                cp: "Peserta didik mampu memahami dan menerapkan akhlak terpuji seperti ikhlas, sabar, syukur, tawakal, dan berbakti kepada orang tua; memahami akhlak terhadap lingkungan; serta menghindari akhlak tercela.",
                materi: [
                    "Ikhlas dalam beramal",
                    "Sabar dalam menghadapi cobaan",
                    "Syukur atas nikmat Allah",
                    "Tawakal kepada Allah",
                    "Birrul walidain (berbakti kepada orang tua)",
                    "Akhlak terhadap lingkungan",
                    "Menghindari ghibah dan namimah",
                    "Menghindari hasad dan dengki"
                ]
            },
            {
                nama: "Fikih",
                cp: "Peserta didik mampu melaksanakan ibadah dengan benar dan penuh kesadaran, memahami hikmah ibadah, mengenal hukum Islam tentang makanan dan minuman halal-haram, serta memahami muamalah sederhana.",
                materi: [
                    "Salat Jumat",
                    "Salat Jenazah",
                    "Salat Hari Raya",
                    "Puasa sunah",
                    "Zakat mal",
                    "Haji dan umrah (pengenalan)",
                    "Makanan halal dan haram",
                    "Jual beli yang diperbolehkan",
                    "Qurban dan aqiqah"
                ]
            },
            {
                nama: "Sejarah Peradaban Islam",
                cp: "Peserta didik mampu memahami perkembangan Islam pasca wafatnya Nabi Muhammad SAW, mengenal Khulafaur Rasyidin, perkembangan ilmu pengetahuan dalam Islam, dan kontribusi Islam bagi peradaban dunia.",
                materi: [
                    "Khulafaur Rasyidin",
                    "Abu Bakar As-Shiddiq",
                    "Umar bin Khattab",
                    "Utsman bin Affan",
                    "Ali bin Abi Thalib",
                    "Perkembangan ilmu pengetahuan Islam",
                    "Ilmuwan Muslim (Ibnu Sina, Al-Khawarizmi)",
                    "Islam di Nusantara",
                    "Walisongo"
                ]
            }
        ],
        dimensiProfil: [
            {
                dimensi: "keimanan",
                deskripsi: "Memiliki keyakinan teguh terhadap rukun iman dan mengamalkan ajaran Islam dengan penuh kesadaran"
            },
            {
                dimensi: "kewargaan",
                deskripsi: "Menunjukkan sikap moderat, cinta tanah air, dan berkontribusi positif dalam kehidupan berbangsa"
            },
            {
                dimensi: "penalaran",
                deskripsi: "Menganalisis permasalahan dengan perspektif Islam dan mengambil keputusan berdasarkan nilai-nilai agama"
            },
            {
                dimensi: "kreativitas",
                deskripsi: "Berinovasi dalam dakwah dan pengembangan diri sesuai ajaran Islam"
            },
            {
                dimensi: "kolaborasi",
                deskripsi: "Membangun kerjasama lintas kelompok dengan menjunjung tinggi ukhuwah Islamiyah"
            },
            {
                dimensi: "kemandirian",
                deskripsi: "Bertanggung jawab penuh atas ibadah dan amal sholeh secara mandiri"
            },
            {
                dimensi: "kesehatan",
                deskripsi: "Menerapkan pola hidup sehat sesuai tuntunan Islam untuk keseimbangan fisik dan mental"
            },
            {
                dimensi: "komunikasi",
                deskripsi: "Menyampaikan pesan dakwah dengan hikmah dan melakukan refleksi diri secara berkala"
            }
        ]
    }
};

// Fungsi helper untuk mendapatkan dimensi berdasarkan ID
function getDimensiById(id) {
    return DIMENSI_PROFIL_LULUSAN.find(d => d.id === id);
}

// Fungsi untuk mendapatkan semua dimensi dengan deskripsi per fase
function getDimensiByFase(fase) {
    const cpData = DATA_CP[fase];
    if (!cpData) return [];
    
    return cpData.dimensiProfil.map(dp => {
        const dimensiInfo = getDimensiById(dp.dimensi);
        return {
            ...dimensiInfo,
            deskripsiFase: dp.deskripsi
        };
    });
}

console.log('Data CP PAI dengan 8 Dimensi Profil Lulusan loaded successfully');