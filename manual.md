# Panduan Instalasi & Deploy Website MyMaiyah.id (Untuk Non-Coder)

Panduan ini dirancang untuk memudahkan Anda meng-online-kan website **MyMaiyah.id** tanpa perlu memahami kode pemrograman yang rumit.

---

## Opsi 1: Deploy Otomatis via Vercel (SANGAT DISARANKAN) ✅
Ini adalah cara termudah, tercepat, dan gratis. Vercel adalah platform resmi pembuat Next.js (teknologi yang kita pakai).

**Persiapan:**
1.  Pastikan kode proyek ini sudah di-upload ke **GitHub**.
2.  Daftar akun di [Vercel.com](https://vercel.com) (Login pakai GitHub).

**Langkah-langkah:**
1.  Buka Dashboard Vercel, klik **"Add New..."** button -> **"Project"**.
2.  Pilih repository **maiyah-news-front** dari daftar GitHub Anda. Klik **Import**.
3.  Di halaman konfigurasi Project:
    *   **Project Name:** Biarkan default atau ganti nama (misal: `mymaiyah-news`).
    *   **Framework Preset:** Pastikan terpilih **Next.js**.
    *   **Root Directory:** Biarkan `./` (kosong).
    *   **Environment Variables:** (Biarkan kosong, karena kita sudah hardcode API URL).
4.  Klik tombol **Deploy**.
5.  Tunggu 1-2 menit. Balon warna-warni akan muncul tanda sukses! 
6.  Website Anda sudah online di alamat `mymaiyah-news.vercel.app`.

*Untuk menyambungkan domain asli (mymaiyah.id):*
*   Masuk ke menu **Settings** > **Domains** di Vercel.
*   Masukkan `mymaiyah.id`.
*   Ikuti instruksi setting DNS (biasanya hanya perlu tambah CNAME/A Record di tempat Anda beli domain).

---

## Opsi 2: Deploy ke Hosting cPanel (Mode Node.js) ⚠️
Gunakan cara ini jika Anda sudah punya hosting (misal: Niagahoster, RumahWeb) dan **WAJIB** ada fitur **"Setup Node.js App"** di cPanel-nya.

**Langkah-langkah:**

### 1. Persiapan File
Di komputer lokal Anda (VS Code):
1.  Buka terminal.
2.  Ketik: `npm run build`
3.  Tunggu sampai ada tulisan "Compiled successfully".
4.  Akan muncul folder baru bernama `.next`.

### 2. Upload File
Masuk ke File Manager cPanel:
1.  Buat folder baru, misal `mymaiyah-app`.
2.  Upload file/folder berikut ke dalamnya:
    *   Folder `.next` (Zip dulu agar mudah upload, lalu ekstrak di sana).
    *   Folder `public` (Isi gambar/aset).
    *   File `package.json`
    *   File `next.config.ts` (atau .js)
3.  **JANGAN** upload folder `node_modules`.

### 3. Setting cPanel
1.  Cari menu **"Setup Node.js App"**.
2.  Klik **"Create Application"**.
3.  **Application Root:** Isi folder tadi (`mymaiyah-app`).
4.  **Application URL:** Pilih domain Anda.
5.  **Application Startup File:** Isi `node_modules/next/dist/bin/next`.
6.  Klik **Create**.
7.  Klik tombol **"Run NPM Install"** (ini akan menginstall dependensi server).
8.  Setelah selesai, klik **"Start App"**.

---

## Opsi 3: Static Export (Khusus Hosting HTML Biasa) ❌
*Cara ini mengubah website menjadi file HTML mati. TIDAK DISARANKAN untuk portal berita karena fitur dinamis & share foto artikel tidak akan jalan sempurna.*

JIKA TERPAKSA (Hosting murah tanpa Node.js):
1.  Buka `next.config.ts`.
2.  Tambahkan baris: `output: 'export',` di dalam `nextConfig`.
3.  Jalankan `npm run build`.
4.  Akan muncul folder `out`.
5.  Upload isi folder `out` ke `public_html` di hosting Anda.

---

## Cara Update Kode Website 🔄
Jika Anda mengedit kode di masa depan (misal mengganti link iklan atau mengubah video banner), lakukan langkah ini agar website live ikut berubah.

**Jika Menggunakan Vercel:**
Cukup jalankan 3 perintah ini di Terminal VS Code Anda:

```bash
git add .
git commit -m "Update konten website"
git push origin main
```

*Penjelasan:*
1.  `git add .` : Memilih semua file yang berubah.
2.  `git commit ...` : Menyimpan perubahan dengan pesan catatan.
3.  `git push ...` : Mengirim kode ke GitHub.
*Setelah kode sampai di GitHub, Vercel akan OTOMATIS mendeteksi dan mengupdate website live Anda dalam 1-2 menit.*

**Jika Menggunakan cPanel:**
Anda harus mengulangi proses **Build** dan **Upload** (hapus file lama di hosting, upload file `.next` baru), lalu restart App Node.js di cPanel.

---

## Catatan Penting
*   **Update Konten Berita:** Cukup posting di WordPress Backend (`assets.mymaiyah.id`). Frontend akan otomatis update (Tergantung setting Cache Revalidation, biasanya sekitar 60 detik).
*   **Gambar Iklan:** Jika ganti gambar iklan, harus edit kode dan deploy ulang (Opsi 1 tinggal push ke Git, Vercel otomatis update).

**Butuh bantuan?** Hubungi tim developer.
