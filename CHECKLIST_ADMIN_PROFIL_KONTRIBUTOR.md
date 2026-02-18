# Checklist Admin Profil Kontributor (Non-Teknis)

Tujuan: memastikan profil kontributor di frontend tampil rapi dan konsisten (foto, bio, dan link sosial).

## 1) Persiapan Sebelum Isi Data

- Login ke WordPress Admin: `http://localhost/v2maiyah/wp-admin`
- Pastikan plugin aktif:
  - `ACF (Advanced Custom Fields)`
  - `WPGraphQL`
  - `Yoast SEO` (untuk social links)
- Pastikan field group `Author Profile` sudah terpasang.

## 2) Edit Profil User (Wajib)

Lakukan untuk setiap kontributor:

1. Buka menu `Users` -> `All Users`.
2. Cari nama kontributor, klik `Edit`.
3. Scroll ke bagian **Author Profile**.
4. Isi field berikut:
   - `Foto Profil` (upload foto kotak/portrait yang jelas)
   - `Biografi Singkat` (2-4 kalimat)
   - `Asal Simpul` (opsional, jika ada)
5. Klik `Update User`.

## 3) Isi Social Media (Opsional tapi Direkomendasikan)

Di halaman user yang sama:

1. Cari bagian profile social (Yoast / field sosial bawaan user).
2. Isi link yang benar (gunakan `https://...`), contoh:
   - Instagram
   - Facebook
   - X/Twitter
   - Website
3. Klik `Update User`.

## 4) Standar Konten yang Harus Dipatuhi

- Foto:
  - Hindari foto blur atau terlalu kecil.
  - Disarankan rasio mendekati 1:1 (square).
- Bio:
  - Tulis ringkas, jelas, tanpa spam.
  - Hindari copy panjang dari artikel.
- Link:
  - Wajib pakai URL lengkap (`https://...`).

## 5) Verifikasi Hasil (Wajib Setelah Update)

Setelah update user:

1. Buka frontend:
   - `http://localhost:3000/kontributor`
   - `http://localhost:3000/kontributor/[slug-user]`
2. Pastikan:
   - Foto sesuai user (bukan foto user lain).
   - Nama dan bio tampil benar.
   - Halaman tidak blank/error.
3. Hard refresh browser (`Ctrl+F5`) jika perubahan belum terlihat.

## 6) Jika Foto Tidak Muncul / Salah

1. Cek ulang apakah foto sudah diupload pada field `Foto Profil`.
2. Klik `Update User` sekali lagi.
3. Buka kembali halaman frontend dan hard refresh.
4. Jika masih salah:
   - Catat URL user (contoh: `/kontributor/abdullahfarid`)
   - Kirim ke tim dev untuk sinkronisasi mapping.

## 7) Prioritas Kerja Tim Admin

- Prioritas 1: kontributor yang paling sering menulis.
- Prioritas 2: kontributor yang fotonya masih default/placeholder.
- Target minimal: 20 kontributor utama selesai dulu, lalu lanjut batch berikutnya.

---

## Ringkasan Cepat

- Data utama profil = **ACF Author Profile**.
- Social links = **Yoast / profile sosial user**.
- Setelah edit user, selalu **Update** lalu **cek di frontend**.
