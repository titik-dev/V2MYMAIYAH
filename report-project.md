
### [13-02-2026] - Phase 13: Critical Fixes & Stability Hardening
*   **Status:** Selesai
*   **Aktivitas:**
    *   **Image Optimization:** Mengatasi warning aspek rasio gambar pada Bottom Nav dan Featured Slider dengan implementasi `w-auto h-auto` dan `fill` mode yang responsif.
    *   **Homepage Stability Check:**
        *   Menemukan isu kritis pada query `wppPopularPosts` yang menyebabkan crash saat data ID null.
        *   Implementasi **Safe Mode Query** (try-catch terisolasi) untuk memastikan homepage tetap load sempurna walau data populer bermasalah.
    *   **Slider/Latest Post Logic Overhaul:**
        *   Mengidentifikasi isu WordPress **Sticky Post** (postingan lama "nempel" di atas slider meski mode Latest).
        *   Menghapus argumen invalid `ignoreStickyPosts` yang sempat mematahkan API.
        *   **Force Sort Implementation:** Menerapkan sorting manual via JavaScript (Date Descending) di frontend untuk memaksa urutan kronologis murni, mengabaikan perilaku default sticky post WordPress.
        *   Hasil: Slider dan Grid Berita kini dijamin 100% menampilkan konten terbaru secara akurat.
    *   **ACF Data Integrity:**
        *   Memperbaiki isu data ACF (Judul Bagian/Section Titles) yang tidak muncul/tercache.
        *   Implementasi `cache: no-store` / `revalidate: 0` pada fetch homepage untuk menjamin perubahan setting di dashboard langsung tayang tanpa delay.

### [13-02-2026] - Phase 14: Fitur Profil Penulis & Tulisan Terbaru
*   **Status:** Selesai
*   **Aktivitas:**
    *   **Author Profile Box:** Menambahkan kotak profil penulis yang elegan di akhir setiap artikel (`AuthorBio.tsx`).
        *   **Hybrid Data Source (Prioritas):**
            1.  **ACF User Profile:** Foto Profil Custom (Circular) & Asal Simpul. (Import JSON `acf-author-profile.json` wajib di WP).
            2.  **Yoast SEO / WP User:** Link Social Media (IG, FB, X, Web) diambil otomatis dari profil user bawaan. Tidak perlu input ulang di ACF.
            3.  **Custom Author (Post Meta):** Fallback foto/bio jika penulis adalah Guest (tidak punya user akun).
            4.  **Fallback Default:** Placeholder gambar Maiyah & Inisial Nama.
    *   **Author Recent Posts:** Menambahkan grid rekomendasi "Tulisan Terbaru dari Penulis Ini" (`AuthorRecentPosts.tsx`).
        *   Logika backend: `getPostsByAuthor(authorId, excludePostId)`.
        *   Hanya aktif untuk **Registered User** (bukan Custom Author tamu), karena butuh ID user untuk query database.
    *   **Category Badge Improvement:**
        *   Memperbaiki posisi badge kategori menjadi overlay di dalam gambar (`top-left`) pada semua view (Home, Category, Detail).
        *   Otomatis menampilkan 3 postingan terbaru dari penulis yang sama.
        *   Mengecualikan (exclude) artikel yang sedang dibaca agar tidak duplikat.
    *   **Category Badge Improvement:**
        *   Memperbaiki posisi badge kategori menjadi di dalam gambar (Pojok Kiri Atas / `top-left`) pada Homepage dan Halaman Kategori.
        *   Memastikan label nama kategori tampil konsisten, menggantikan Database ID yang sebelumnya muncul.
