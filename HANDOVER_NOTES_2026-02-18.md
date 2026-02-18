# HANDOVER NOTES - 18 FEBRUARI 2026

## Status Singkat
- Agenda lokal sudah aktif end-to-end (WordPress local -> GraphQL -> Frontend local).
- Isu utama hari ini bukan di frontend, melainkan di backend schema (CPT belum terdaftar).
- Scope saat ini disepakati: fokus validasi di localhost dulu, Vercel belakangan.

## Ringkasan Masalah yang Terjadi
1. Menu `Agenda` tidak muncul di sidebar WordPress.
2. Query GraphQL `agendas` awalnya gagal (`Cannot query field "agendas" on type "RootQuery"`).
3. User sempat melihat data berbeda di Vercel dibanding lokal.
4. Di GraphQL IDE sempat muncul syntax error karena format request salah (JSON body ditempel ke editor query mentah).

## Root Cause
1. Custom Post Type `agenda` belum terdaftar di WordPress local.
2. File `acf-export-agenda.json` hanya mendefinisikan field ACF, bukan mendaftarkan CPT.
3. Frontend Vercel membaca backend production (`assets.mymaiyah.id`), bukan `localhost`.
4. Komponen kalender menampilkan daftar event berdasarkan **tanggal terpilih**, bukan otomatis semua event.

## Tindakan yang Sudah Dilakukan
1. Verifikasi source code frontend:
- `src/lib/api.ts` memang query `agendas` / `agendaDetails`.
- `src/lib/wp.ts` dan `.env.local` memang mengarah ke `http://localhost/v2maiyah/graphql` untuk local dev.

2. Verifikasi backend lokal:
- `http://localhost/v2maiyah/wp-json` aktif.
- `http://localhost/v2maiyah/graphql` aktif.
- Setelah CPT tersedia, query `agendas` berhasil dan mengembalikan data publish.

3. Verifikasi data real:
- Local GraphQL mengembalikan agenda baru: `JUGURAN SYAFAAT` dengan `tanggalEvent` 2026-02-20.
- Production GraphQL (`https://assets.mymaiyah.id/graphql`) masih berisi data lama (`RELEGI`, `KAJIAN` tanggal 5).

4. Klarifikasi penggunaan GraphQL IDE:
- Editor query harus berisi syntax GraphQL mentah, bukan objek JSON `{ "query": "..." }`.

## Konfirmasi Hasil Akhir Hari Ini
- Dari screenshot user, query GraphQL lokal sudah sukses dan data agenda tampil valid.
- Artinya koneksi lokal backend -> frontend sudah benar.
- Jika event tidak langsung terlihat di halaman kalender, klik tanggal event yang sesuai (contoh: tanggal 20), karena UI memakai selected date filter.

## Catatan Penting untuk Developer Selanjutnya
1. Untuk cloud frontend (Vercel), `localhost` tidak bisa dipakai langsung sebagai backend source.
2. Jangan mencampur diagnosis local vs production; selalu pastikan endpoint yang sedang diuji.
3. Jika ada isu "data tidak muncul", cek urutan ini:
- status post `publish`
- CPT terdaftar + `show_in_graphql`
- query GraphQL endpoint target berhasil
- perilaku filter UI (selected date)

## Referensi File Terkait
- `acf-export-agenda.json`
- `src/lib/api.ts`
- `src/lib/wp.ts`
- `src/components/features/agenda/CalendarWidget.tsx`
- `src/app/daur-maiyahan/page.tsx`

## Keputusan Operasional
- Tetap lanjut validasi fitur di localhost terlebih dahulu.
- Migrasi/pengujian ke Vercel dilakukan setelah parity lokal dinyatakan stabil.
