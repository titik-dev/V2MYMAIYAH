# Laporan Troubleshooting & Bug Fixing (Maiyah-News-Front)

Dokumen ini berisi rangkuman masalah teknis (bug/error) yang ditemui selama pengembangan proyek dari awal hingga sekarang, beserta solusi dan perbaikannya. Berguna sebagai referensi teknis di masa depan.

---

## 1. Production Build Error (Blank Screen)
**Tanggal:** 19-12-2025
*   **Masalah:** Saat di-deploy ke production, website menampilkan layar putih blank, meskipun berjalan normal di local server.
*   **Penyebab:** Konflik versi React ("React version mismatch") antara dependensi Next.js app router dengan beberapa library UI lama.
*   **Solusi:** Melakukan audit dependensi `package.json`, mengunci versi React ke 19 (RC), dan memastikan semua library UI support React Server Components.

## 2. WordPress Site Editor 500 Internal Server Error
**Tanggal:** 23-12-2025
*   **Masalah:** Tidak bisa mengakses Site Editor di dashboard WordPress (Backend).
*   **Penyebab:** Kesalahan sintaks pada file `theme.json` atau pola PHP custom theme yang menyebabkan Fatal Error saat WordPress mencoba merender preview blok.
*   **Solusi:** Memperbaiki struktur JSON dan memvalidasi kode PHP pada file `patterns`.

## 3. Cache Invalidation (Update Konten Lambat)
**Tanggal:** 12-12-2025
*   **Masalah:** Perubahan konten (judul/gambar) di WordPress tidak langsung muncul di website live (Vercel) setelah deploy.
*   **Penyebab:** Konfigurasi Caching Header (CDN) yang terlalu agresif menyimpan versi lama halaman HTML.
*   **Solusi:** Mengatur ulang `Cache-Control` header dan `revalidate` time pada fetching data (ISR - Incremental Static Regeneration) agar konten diperbarui otomatis secara berkala.

## 4. Mobile Layout Overflow (Horizontal Scroll)
**Tanggal:** 28-12-2025
*   **Masalah:** Tampilan "pecah" atau bergeser ke kanan-kiri pada browser mobile tertentu (Safari iOS, Brave Android).
*   **Penyebab:** Elemen dengan lebar fix (>100vw) atau margin negatif yang tidak terbungkus dengan benar.
*   **Solusi:** Menerapkan CSS global `overflow-x: hidden;` pada body dan memastikan semua container utama menggunakan `max-width: 100vw`.

## 5. SSL / Mixed Content Error
**Tanggal:** 06-01-2026
*   **Masalah:** Gambar dari backend tidak muncul atau API error saat fetch data.
*   **Penyebab:** Aplikasi frontend (HTTPS) mencoba mengambil data dari backend lokal (HTTP) atau sertifikat SSL self-signed ditolak oleh Node.js.
*   **Solusi:**
    *   Sementara: Menggunakan `NODE_TLS_REJECT_UNAUTHORIZED=0`.
    *   Permanen: Migrasi backend ke server live (`http://localhost/v2maiyah`) yang memiliki sertifikat SSL valid.

## 6. GraphQL Nested Node Error (Gambar Hilang)
**Tanggal:** 07-01-2026
*   **Masalah:** Query GraphQL untuk mengambil gambar di dalam Repeater (misal: Footer Images) mengembalikan error atau `null`.
*   **Penyebab:** Struktur query salah meminta field `node` di tempat yang seharusnya langsung mengembalikan objek gambar (tergantung setelan "Return Format" di ACF).
*   **Solusi:** Menyesuaikan query GraphQL dengan skema ACF yang benar (memeriksa apakah return format ACF adalah 'Image Array' atau 'Image URL').

## 7. Homepage Double-Fetching Performance
**Tanggal:** 12-02-2026
*   **Masalah:** Halaman depan melakukan pemanggilan API (Request) ganda untuk data yang sama, memperlambat load time.
*   **Penyebab:** Logic `getHomepageData()` dipanggil sekali di awal, lalu dipanggil lagi di baris bawah hanya untuk mengambil variabel `mode`.
*   **Solusi:** Refactoring kode `page.tsx`. Mengambil semua variabel (`mode`, `ads`, `posts`) dari pemanggilan API pertama, menghapus pemanggilan kedua yang mubazir.

## 8. 404 pada Halaman Kategori Spesifik
**Tanggal:** 06-01-2026
*   **Masalah:** Url kategori `/category/simpul-maiyah/mukaddimah` error 404 di lokal tapi bisa di server.
*   **Penyebab:** Perbedaan struktur permalink atau data kategori (slug) antara database lokal dan live.
*   **Solusi:** Menyamakan slug kategori dan memastikan routing dinamis Next.js menangkap semua segmen path dengan benar (`[...slug]`).

## 9. Next.js Image Optimization (Gambar Buram/Lambat)
**Tanggal:** 07-01-2026
*   **Masalah:** Gambar terlihat pecah atau loading sangat lambat di mobile.
*   **Penyebab:** Konfigurasi `unoptimized: true` (sebelumnya dipakai untuk static export) mematikan fitur optimasi gambar otomatis Vercel.
*   **Solusi:** Menghapus `unoptimized: true` dan menambahkan properti `sizes="..."` pada komponen `<Image />` agar browser mengambil ukuran gambar yang tepat sesuai layar HP.

## 10. Homepage "Internal Server Error" Crash
**Tanggal:** 13-02-2026
*   **Masalah:** Halaman depan mendadak error 500 (Full Crash) setelah instalasi plugin populer.
*   **Penyebab:** Query GraphQL `wppPopularPosts` (dari plugin WordPress Popular Posts) mengembalikan data yang korup (salah satu post memiliki ID null) yang tidak bisa di-handle oleh frontend, menyebabkan React hydration error fatal.
*   **Solusi:** Membungkus pemanggilan API `wppPopularPosts` dalam blok `try...catch` terpisah (Safe Mode). Jika query ini gagal, error ditangkap dan log di-warn, sementara halaman web tetap berjalan normal menampilkan konten lainnya.

## 11. Sticky Post & Urutan Berita Slider
**Tanggal:** 13-02-2026
*   **Masalah:** Slider "Terbaru" menampilkan postingan lama (tahun 2023) di urutan pertama, padahal seharusnya hanya menampilkan berita 2026.
*   **Penyebab:**
    1.  WordPress memiliki fitur "Sticky Post" yang secara default akan menempatkan postingan tersebut di paling atas query, mengabaikan parameter sorting tanggal (`orderby: DATE`).
    2.  Percobaan menggunakan parameter `ignoreStickyPosts: true` pada query GraphQL menyebabkan error API karena argumen tersebut tidak valid/didukung oleh skema WPGraphQL saat ini.
*   **Solusi:**
    1.  Menghapus argumen `ignoreStickyPosts` yang error dari query backend.
    2.  Mengimplementasikan **Force Sort (Manual Sorting)** di sisi Frontend (JavaScript). Data `posts` dan `featuredPosts` yang diterima dari API diurutkan ulang secara paksa menggunakan `sort()` berdasarkan tanggal descending (`new Date(b.date) - new Date(a.date)`). Ini memastikan berita terbaru secara kronologis selalu tampil di awal slider, terlepas dari status sticky di backend.

## 12. ACF Data Caching (Judul Bagian Tidak Update)
**Tanggal:** 13-02-2026
*   **Masalah:** Perubahan teks Judul Bagian (Section Titles) di Dashboard ACF tidak kunjung muncul di frontend (tetap menampilkan teks default/lama).
*   **Penyebab:** Next.js Data Cache secara agresif menyimpan response fetch API homepage, sehingga update kecil di CMS tidak terdeteksi.
*   **Solusi:** Menambahkan opsi `{ next: { revalidate: 0 } }` (No-Store) pada fungsi `fetchAPI` khusus untuk data homepage. Ini memaksa server untuk selalu mengambil data segar dari WordPress setiap kali halaman diakses, menjamin konten dinamis ACF selalu akurat.

## 13. Author Profile Box & Recent Posts Integration
**Tanggal:** 13-02-2026
*   **Masalah:**
    1.  **Field `authorProfile` Kosong:** API gagal mengambil data ACF User karena field belum dibuat di backend WP, menyebabkan error fetch.
    2.  **Social Media Duplikasi:** Awalnya berencana membuat field sosmed baru di ACF, padahal WordPress/Yoast sudah menyediakan.
    3.  **Foto Profil Masih Gravatar:** Setelah ACF JSON diimport dan diisi, foto tetap tidak muncul di frontend (masih placeholder).

*   **Penyebab & Solusi:**
    1.  **ACF JSON Export:** Solusi untuk masalah field kosong adalah membuatkan file `acf-author-profile.json` berisi definisi field (Foto, Bio, Simpul) agar admin bisa langsung import di WP tanpa setting manual.
    2.  **Yoast SEO Integration:** Memutuskan untuk **TIDAK** membuat field sosmed baru. Sebaliknya, mengubah query GraphQL di `api.ts` untuk mengambil data dari field bawaan `seo { social { ... } }` (Facebook, Instagram, dll). Ini lebih efisien.
    3.  **Uncomment Code (Critical):** Penyebab foto tidak muncul meski backend sudah siap adalah karena kode pemanggil `authorProfile` di `src/lib/api.ts` masih dalam kondisi *commented out* (dimatikan) untuk mencegah error sebelumnya. Solusinya adalah **menyalakan kembali (uncomment)** blok kode tersebut setelah dipastikan data backend tersedia via tes di GraphQL IDE.

*   **Cara Verifikasi Data:**
    Gunakan Query GraphQL ini di IDE untuk memastikan data masuk sebelum menyalakan kode frontend:
    ```graphql
    query CekAuthor {
      user(id: "USER_ID", idType: DATABASE_ID) {
        name
        authorProfile {
          fotoProfil { node { sourceUrl } }
        }
        seo {
          social {
            facebook
            instagram
          }
        }
      }
    }
    ```
