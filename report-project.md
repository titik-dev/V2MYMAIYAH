# Log Proyek: Maiyah-News-Front

**Mulai Proyek:** 28 Desember 2024
**Tujuan:** Membangun frontend modern untuk portal berita Maiyah News dengan Next.js 16, mengejar standar UI/UX premium sesuai referensi.

---

## Log Aktivitas

### [28-12-2024] - Initial Setup & Foundation
*   **Status:** Selesai
*   **Aktivitas:**
    *   Setup Next.js 16 (App Router) + React 19 + Tailwind CSS 4.
    *   Integrasi data via GraphQL ke Backend WordPress Lokal (`http://127.0.0.1/backmaiyah/graphql`).
    *   Pembuatan struktur folder dasar (`src/app`, `src/components`, `src/lib`).

### [28-12-2024] - Core Features Implementation
*   **Status:** Selesai
*   **Aktivitas:**
    *   **API Layer:** Membuat `lib/api.ts` untuk fetching data (Get Posts, Get Category, Get Post by Slug).
    *   **Home Page:** Implementasi Hero Section (Featured Post) dan Grid Berita Terbaru.
    *   **Mobile Menu:** Membuat slide-over menu dengan animasi transisi, toggle Dark Mode, dan Form Pencarian.
    *   **Category Page:** Routing dinamis `/category/[slug]` menampilkan arsip berita per kategori.

### [28-12-2024] - Analisis & Perencanaan UI/UX (Current)
*   **Status:** Dalam Proses
*   **Aktivitas:**
    *   Analisis mendalam referensi UI pada `http://localhost:5000`.
    *   Identifikasi Design System: Warna (Primary Blue `#0066b2`, Accent Red `#e21c23`), Tipografi (Sans-Serif Modern), dan Pola Navigasi (Bottom Bar, Horizontal Scroll).
    *   Penyusunan dokumen `perencanaan.md` untuk roadmap penyesuaian desain.

### [28-12-2024] - Phase 1: Design Tokens & Base Styles
*   **Status:** Selesai
*   **Aktivitas:**
    *   **Globals CSS:** Menambahkan token warna custom `--color-maiyah-blue` (#0066b2), `--color-maiyah-red` (#e21c23), dan `--color-maiyah-bg`.
    *   **Root Layout:** Mengganti background body menjadi radial gradient yang halus sesuai referensi, menggantikan background abu-abu polos.
    *   **Typography:** Memastikan font Inter sebagai font utama (sans-serif) sesuai analisis.

### [28-12-2024] - Phase 2: Structural Layout Updates
*   **Status:** Selesai
*   **Aktivitas:**
    *   **CategoryPills:** Membuat komponen navigasi kategori horizontal (`src/components/layout/CategoryPills.tsx`) yang sticky di bawah header.
    *   **Header Redesign:** Mengubah Header menjadi minimalis (putih/bersih), memindahkan menu kategori ke CategoryPills.
    *   **Bottom Navigation:** Menambahkan `BottomNav.tsx` untuk navigasi mobile fixed-bottom (Home, Tajuk, Cari, Akun) menggunakan Heroicons.
    *   **Layout Integration:** Mengupdate `layout.tsx` untuk memuat BottomNav dan menyesuaikan padding agar konten tikad tertutup.

### [28-12-2024] - Phase 3: Component Refactoring (Home Page)
*   **Status:** Selesai
*   **Aktivitas:**
    *   **Hero Section Redesign:** Mengubah layout hero menjadi container-width dengan rounded corners besar, overlay gradient modern, dan tipografi yang lebih tajam.
    *   **Responsive News Feed:** Mengimplementasikan transformasi layout kartu berita: Horizontal List (Mobile) vs Vertical Grid (Desktop).
    *   **Visual Polishing:** Menambahkan shadow halus, animasi hover scale pada gambar, dan indikator kategori berwarna tema.

### [28-12-2024] - Phase 4: Page Completion
*   **Status:** Selesai
*   **Aktivitas:**
    *   **Single Post Page:** Membuat halaman `/berita/[slug]` dengan layout artikel profesional (Hero image, Typography plugin, Author meta).
    *   **Search Page:** Membuat halaman `/pencarian` yang menangkap query parameter dan menampilkan hasil pencarian real-time dari API.
    *   **Typography:** Menginstall `@tailwindcss/typography` untuk styling otomatis konten artikel dari WordPress.

### [28-12-2024] - Phase 5: Polishing & Optimization
*   **Status:** Selesai
*   **Aktivitas:**
    *   **Loading UI:** Menambahkan `loading.tsx` untuk menampilkan efek skeleton saat transisi halaman, meningkatkan persepsi performa.
    *   **Theme Toggle Update:** Menyesuaikan warna tombol dark mode agar kontras dengan header putih baru.
    *   **Final Verification:** Memastikan seluruh alur (Home -> Category -> Post) berjalan mulus tanpa layout shift yang mengganggu.

### [28-12-2024] - Phase 6: Refinement & Migration (Advanced)
*   **Status:** Selesai (High Impact Update)
*   **Aktivitas:**
    *   **Backend Migration:** Sukses mengalihkan sumber data sepenuhnya ke `assets.mymaiyah.id`, memastikan konten live dan gambar terload sempurna.
    *   **Global Theme Lock:** Mengunci website ke **Permanent Light Mode**. Menghapus kompleksitas Dark Mode untuk menjamin konsistensi visual dan kontras warna 100%.
    *   **Navigation Revamp:**
        *   **Mobile Menu:** Transformasi total menjadi **Left-Sliding Drawer** dengan background putih dan list vertikal rapi.
        *   **Category Pills:** Mengubah menjadi **Static Menu** (Maiyah, Berita, Simpul Maiyah, Esai, Agenda) untuk kontrol penuh urutan.
    *   **Category Page Redesign:**
        *   Implementasi gaya **"Card Overlay"** premium ala CakNun.com.
        *   Menambahkan **Identity Badge (Nomor)** pada setiap kartu dengan layout responsif (lebar otomatis).
    *   **Home Page Experience:**
        *   **Hero Video:** Menghadirkan video autoplay mandiri (Greeting Mbah Nun) dengan rasio adaptif (Portrait di Mobile, Wide di Desktop).
        *   **Ads Section (Ceklis):** Integrasi 3 banner iklan eksternal dengan teknik **Intrinsic Responsive Image** agar gambar tampil utuh.
        *   **Content Segmentation:** Memecah stream berita menjadi section "Terbaru" dan "Terpopuler" untuk variasi konten.
    *   **Visual Integrity:** Standardisasi warna judul menggunakan **Maiyah Blue** untuk keterbacaan maksimal di atas background terang.

### [29-12-2024] - Phase 7: Advanced Dynamic Content & UI Polishing
*   **Status:** Selesai
*   **Aktivitas:**
    *   **Custom Author Integration:**
        *   Backend: Implementasi ACF Field Group untuk Custom Author (Nama, Foto, Bio).
        *   Frontend: Logic fallback pintar (Custom > Default WP) di Halaman Berita.
    *   **Redesign Single Post Hero:**
        *   Evolusi UI ke **"Cinema Mode Clean Stacked"**.
        *   Gambar ditampilkan utuh (contain) dengan ambience blur background.
        *   Judul & Meta dipisah ke bawah gambar untuk keterbacaan 100%.
    *   **Dynamic Homepage Ads:**
        *   Implementasi Backend ACF Repeater pada "Front Page" untuk manajemen banner iklan.
        *   Integrasi Frontend dengan struktur GraphQL yang aman (`node` edge support).
    *   **Documentation:**
### [04-01-2025] - Phase 8: Agenda System, Advanced Navigation & Stability
*   **Status:** Selesai
*   **Aktivitas:**
    *   **Daur Maiyahan (Agenda) System:**
        *   **Frontend Banner:** Implementasi Hero Banner dinamis di halaman Detail Agenda, menggunakan `featuredImage` dengan gradient overlay.
        *   **Calendar Widget Refinement:**
            *   Membersihkan UI Header: Menghapus tombol View Switcher (Hari/Minggu/Bulan) dan tombol Pencarian untuk tampilan yang lebih bersih.
            *   **Smart Indicators:** Meningkatkan visibilitas tanggal beragenda dengan styling kontras (Teks Bold Merah + Background Lingkaran Merah Muda) agar mudah dipindai mata.
    *   **Navigation System Overhaul:**
        *   **Hierarchical Menu:** Integrasi menu bertingkat (Parent > Submenu) dari ACF Backend Global.
        *   **Responsive Behavior:**
            *   **Desktop:** Menu rata tengah dengan Dropdown minimalis.
            *   **Mobile:** Transformasi menu menjadi **Flattened Horizontal Scroll** (Parent dan Anak sejajar) untuk UX mobile yang lebih cepat dan intuitif.
    *   **Smart Typography System (Custom Titles):**
        *   Implementasi logika Tampilan Judul Kustom (ACF):
            *   **Prefix (Kicker):** Teks merah di atas judul (e.g., "Tadabbur Hari Ini (66)").
            *   **Visual H1 Replacement:** Opsi mengganti Judul Utama di layar dengan "Sub Judul" yang lebih ringkas/estetik, tetap menjaga `meta title` asli untuk SEO.
            *   **HTML Stripping:** Pembuatan utility `stripHtml` robust untuk membersihkan tag HTML sampah dari input judul lama.
    *   **Critical Browser Compatibility Fixes:**
        *   **Mobile Overflow Fix:** Menangani isu layout "pecah/geser" pada browser Brave/Safari Mobile dengan menerapkan `overflow-x-hidden` global pada `<body>` dan `max-width: 100vw` wrapper.
        *   **Scroll Mechanics:** Mengaktifkan `-webkit-overflow-scrolling: touch` untuk scroll menu yang mulus di iOS.
    *   **Final Deployment:**
        *   **Vercel Production:** Sukses mendeploy aplikasi ke Vercel (`mymaiyah-news.vercel.app`) dengan koneksi backend `assets.mymaiyah.id` yang stabil.
        *   **Status Verifikasi:** Website Live, Cepat, dan Gambar terload sempurna. Fitur Judul Merah tervalidasi sukses di production.

### [06-01-2026] - Phase 9: Dynamic Global Navigation & Security Hardening
*   **Status:** Selesai
*   **Aktivitas:**
    *   **Global Navigation System:**
        *   **Backend:** Implementasi `Global Navigation Manager` di ACF untuk manajemen terpusat (Desktop Menu, Mobile Drawer, Bottom Nav) dalam satu Field Group.
        *   **Frontend:** Refactoring `Header.tsx`, `MobileMenu.tsx`, dan `BottomNav.tsx` untuk mengambil data menu dinamis dari API.
        *   **Fail-safe Mechanism:** Implementasi logika *fallback* cerdas (jika menu baru kosong, tampilkan menu default) agar tampilan tidak rusak saat transisi data.
    *   **Security & Stability:**
        *   **SSL Fix:** Menghapus bypass safety `NODE_TLS_REJECT_UNAUTHORIZED` karena koneksi ke `assets.mymaiyah.id` sudah terverifikasi aman (HTTPS Valid).
    *   **Bottom Nav Refinement:**
        *   Update default items: Beranda, Maiyah's Wisdom, Kolom Maiyah, Daur Maiyahan, Opini.
        *   Menambahkan mapping ikon lengkap (Home, Heart, Newspaper, Calendar, Pencil, dll) untuk dukungan dinamis.

### [07-01-2026] - Phase 10: SEO Audit & Performance Tuning
*   **Status:** Selesai
*   **Aktivitas:**
    *   **SEO Metadata Hardening:**
        *   Implementasi `canonical` link tag untuk mencegah duplikat konten.
        *   Menambahkan semantic `<h1 class="sr-only">` pada Homepage untuk aksesibilitas dan SEO yang lebih baik.
        *   Update semua Social Open Graph Images (OG Image) menjadi `https` untuk keamanan.
    *   **Performance Boost:**
        *   Reset konfigurasi `next.config.ts` (menghapus `unoptimized: true`) untuk mengaktifkan **Next.js Image Optimization**.
        *   Menambahkan properti `sizes` responsive pada Image Component untuk Iklan dan Berita, mengurangi payload gambar drastis di Mobile.
        *   Audit aset menunjukkan penurunan ukuran file JS dan Image yang signifikan saat mode Production.

### [07-01-2026] - Phase 11: Dynamic Footer & Advanced Navigation Separation
*   **Status:** Selesai
*   **Aktivitas:**
    *   **Dynamic Footer Implementation:**
        *   Pembuatan modul **Footer Manager** di ACF untuk konten dinamis: Logo (Multi), Deskripsi, Sosmed, dan Copyright.
        *   Integrasi Frontend: `Footer.tsx` mengambil data via GraphQL dengan penanganan error yang robust.
        *   **Bugfix:** Menyelesaikan isu "Nested Node Error" pada ACF Repeater untuk field gambar di GraphQL.
        *   **Stability:** Mengarahkan query data ke Root URL (`/`) secara dinamis untuk ketahanan jangka panjang.
    *   **Navigation Architecture Refinement:**
        *   **Unified Menu Strategy:** Menggabungkan sumber data Menu Desktop dan Mobile Drawer untuk konsistensi konten.
        *   **Pill Menu Separation:** Memisahkan logika "Pill Menu" (Swipe Menu) dari struktur navigasi utama.
        *   **Feature Update:** Menambahkan Tab khusus "Pill Menu (Swipe)" di ACF Global Navigation agar user bisa mengatur link swipe secara independen tanpa mencampuri menu utama.
