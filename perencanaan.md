# Perencanaan Pengembangan UI/UX: Maiyah-News-Front

Dokumen ini berisi roadmap dan detail teknis untuk menyelaraskan desain `maiyah-news-front` dengan referensi target (`localhost:5000`).

## 1. Analisis Design System (Referensi)

### Palet Warna
*   **Primary Blue:** `#0066b2` (Brand Identity, Header, Active States)
*   **Accent Red:** `#e21c23` (CTA, Kategori/Tag, Notifikasi)
*   **Background:** `#ffffff` dengan nuansa gradien halus (`#ebf4fb` ke putih) untuk memberikan kedalaman.
*   **Text:** Dark Grey `#1a1a1a` (Body), Black `#000000` (Headings).

### Tipografi
*   **Family:** Sans-Serif Modern (Inter / Montserrat).
*   **Hierarki:**
    *   **H1/Hero:** Bold, Large, High Contrast.
    *   **Card Title:** Semi-Bold, Tight Line Height.
    *   **Meta/Tags:** Small, Uppercase, Bold Tracking Widest.

### Komponen Kunci (Key Components)
1.  **Mobile-First Navigation:**
    *   Bottom Navigation Bar (Fixed) untuk akses cepat (Home, Kategori, Search, Akun).
    *   Top Header Minimalis dengan Logo.
    *   Horizontal Scrollable Category Pills (Tab Kategori yang bisa digeser).
2.  **Card Styles:**
    *   **Rounded Corners:** Radius besar (`rounded-xl` atau `rounded-2xl`).
    *   **Shadows:** Soft shadows (`shadow-sm` hingga `shadow-md`) untuk kedalaman.
    *   **Interactiveness:** Hover efek halus pada skala gambar.
3.  **Layout Patterns:**
    *   **Hero:** Full-width atau Card besar dengan overlay teks di bawah.
    *   **List Berita:** Layout Horizontal (Kiri: Gambar, Kanan: Teks) yang sangat nyaman di mobile.

---

## 2. Roadmap Implementasi

### Phase 1: Design Tokens & Base Styles
*   [ ] Update `globals.css` / Tailwind Config dengan palet warna baru.
*   [ ] Set font default ke Sans-Serif yang sesuai (misal: Inter dari Google Fonts).
*   [ ] Buat utility class untuk gradien background body.

### Phase 2: Structural Layout Updates
*   [ ] **Header (Desktop & Mobile):** Ubah menjadi minimalis, tambahkan Horizontal Scrollable Categories.
*   [ ] **Bottom Navigation (Mobile):** Implementasi komponen baru `BottomNav.tsx` yang fix di bawah layar.
*   [ ] **Layout Wrapper:** Pastikan padding bawah cukup agar konten tidak tertutup Bottom Nav.

### Phase 3: Component Refactoring
*   [ ] **HeroCard:** Redesign `src/app/page.tsx` hero section agar sesuai referensi (Rounded, Overlay Style).
*   [ ] **NewsCard:** Ubah tampilan grid berita menjadi style horizontal list (kiri gambar, kanan info) untuk mobile, dan grid card untuk desktop.
*   [ ] **CategoryPills:** Komponen baru untuk navigasi kategori horizontal.

### Phase 4: Page Completion (Hutang Fitur)
*   [ ] **Single Post Page (`/berita/[slug]`):** Implementasi layout detail berita dengan style baru.
*   [ ] **Search Results Page:** Halaman hasil pencarian yang terintegrasi.

### Phase 5: Polishing
*   [ ] Micro-animations (Button press, Link hover).
*   [ ] Loading States (Skeleton UI).
*   [ ] SEO Tags Optimization.

---

## 3. Catatan Teknis
*   Pastikan penggunaan `next/image` dioptimalkan dengan properti `sizes` yang tepat.
*   Gunakan `clsx` atau `tailwind-merge` untuk manajemen class dinamis yang lebih rapi.
*   Pastikan responsivitas diuji pada breakpoint mobile (375px) dan desktop (1280px).
