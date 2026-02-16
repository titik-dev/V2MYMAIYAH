# LAPORAN PENYELESAIAN & HANDOVER PEKERJAAN - 16 FEBRUARI 2026

## 📌 Status: SELESAI & STABIL
Dokumen ini dibuat sebagai acuan utama (BIG NOTE) untuk developer selanjutnya agar **DILARANG KERAS** mengulangi kesalahan overwrite konfigurasi global.

---

## 1. Fitur Baru: Dynamic Mobile Drawer Logo
Tujuan utama hari ini adalah memungkinkan admin untuk mengganti logo di bagian bawah menu drawer mobile melalui ACF.

**Status Akhir:**
- Backend: Field `mobile_drawer_logo` sudah aktif di **Maiyah Global Settings > Menu & Navigasi**.
- Frontend: Logo sudah dinamis. Jika user upload gambar, logo berubah. Jika tidak, pakai default.
- API: Menggunakan struktur `node { sourceUrl }` untuk kompatibilitas data gambar ACF.

---

## 2. Fitur Baru: Adaptive Dark Mode Header (Desktop)
Menambahkan dukungan Dark Mode yang adaptif pada Header Desktop agar tidak "mati gaya" (selalu hitam) saat mode Light aktif.

**Status Akhir:**
- **Adaptif:** Header sekarang berwarna PUTIH di Light Mode, dan HITAM di Dark Mode (sebelumnya hardcoded hitam).
- **Logo Switching:**
  - Light Mode: Logo Utama berwarna Hitam/Warna Asli.
  - Dark Mode: Logo Utama berubah menjadi Putih (White version).
- **Utility Icons:** Tombol Dark Mode & Search sudah diperbaiki warnanya agar selalu kontras.

---

## 3. Update Style: Halaman Daur Maiyahan
Mengubah style judul halaman Daur Maiyahan menjadi huruf kapital (UPPERCASE) sesuai permintaan user.

**Status Akhir:**
- Judul Halaman: "DAUR MAIYAHAN" (Uppercase).
- Style: `uppercase` class ditambahkan pada elemen `<h1>`.

---

## 4. Masalah Kritis (Resolved)
Selama pengerjaan, terjadi kendala fatal yang **WAJIB DIHINDARI** di masa depan:

### A. Bahaya File Parsial
Developer sebelumnya (saya) sempat mengimport file parsial `acf-export-global-navigation.json` yang hanya berisi menu.
**Dampak:** Settingan Homepage (Judul Section "Khobar Maiyah", Iklan Ceklis, Featured Posts) **HILANG/TER-RESET** kembali ke default ("Berita Terbaru", "Ceklis").

### B. Duplikasi Field Group
Terjadi duplikasi Field Group "Global Navigation Manager" karena import file parsial tersebut memiliki ID/Key yang berbeda atau konflik dengan yang sudah ada.
**Dampak:** Error GraphQL `Cannot query field` karena API bingung membaca field group ganda.

---

## 5. Solusi Permanen & Konfigurasi Saat Ini
Untuk memperbaiki masalah di atas, saya telah melakukan langkah berikut:

1.  **MENGHAPUS** Field Group duplikat yang parsial.
2.  **MENGGUNAKAN SATU FILE MASTER (Unified):**
    File: `acf-export-global-settings-unified.json`
    Ini adalah satu-satunya file yang boleh digunakan untuk restore settingan global. File ini berisi GABUNGAN dari:
    *   Pengaturan Menu & Navigasi (termasuk fitur Logo baru).
    *   Pengaturan Homepage (Iklan, Judul Section).
    *   Pengaturan Footer & Custom CSS.

3.  **Memperbaiki Query API:**
    File `src/lib/api.ts` telah diupdate untuk menangani return format ACF Image yang terkadang membungkus data dalam `node`.
    ```typescript
    mobileDrawerLogo {
      node {
        sourceUrl
      }
    }
    ```

---

## 6. ⚠️ INSTRUKSI UNTUK DEVELOPER SELANJUTNYA (PENTING!)
Jika Anda ingin mengubah atau menambahkan fitur pada Global Settings di masa depan:

1.  **JANGAN PERNAH** mengimport file JSON kecil/parsial seperti `acf-export-menu-manager.json` atau `acf-export-homepage-ads.json` KECUALI Anda yakin 100% isinya sudah disinkronkan dengan Master.
2.  **SELALU GUNAKAN** file `acf-export-global-settings-unified.json` sebagai acuan backup/restore utama.
3.  Jika menambah field baru di ACF Backend:
    *   Pastikan menambahkannya di Field Group: **"Maiyah Global Settings"** (ID: `group_global_settings`).
    *   Jangan membuat Field Group baru dengan nama yang mirip.
    *   Setelah selesai, segera **Export** field group tersebut dan simpan/update ke file `acf-export-global-settings-unified.json` agar kode sinkron dengan file backup.

---

## 7. Daftar File yang Diubah Hari Ini
Silakan cek file-file ini untuk melihat perubahan terakhir:

1.  `src/lib/api.ts` (Update query `getGlobalNavigation` dengan struktur `node`).
2.  `src/components/layout/Header.tsx` (Update prop `logoUrl` untuk membaca `node.sourceUrl` & Adaptive Header).
3.  `src/components/layout/MobileMenu.tsx` (Logic display logo & fallback).
4.  `src/components/layout/ThemeToggle.tsx` (Perbaikan hover state & adaptive color).
5.  `src/components/features/search/SearchTrigger.tsx` (Perbaikan warna teks mode desktop).
6.  `acf-export-global-settings-unified.json` (File Master ACF).
7.  `src/app/daur-maiyahan/page.tsx` (Update style H1 menjadi Uppercase).

---
**Tertanda,**
**Lead Senior Full Stack Engineer**
**16 Februari 2026**
