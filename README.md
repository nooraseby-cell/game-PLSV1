# Petualangan Bintang Energi — PLSV Kelas VIII

Game edukasi petualangan untuk siswa SMP Kelas VIII yang melatih **Persamaan Linier Satu Variabel (PLSV)**: menentukan nilai x dengan sifat kesetaraan dan memeriksa jawaban dengan substitusi.

## Cerita dan Tokoh

Kamu adalah penjelajah luar angkasa. Jawab soal PLSV untuk membuka pintu berikutnya dan kumpulkan bintang energi. Setiap pintu yang terbuka membawamu makin dekat ke akhir petualangan.

## Cara Bermain

1. Buka `index.html` di browser (HP atau laptop). Tidak perlu internet dan tidak perlu instalasi.
2. Isi **Nama Pemain** di layar mulai, lalu tekan **MULAI PETUALANGAN**.
3. Baca persamaan atau soal cerita di kartu pertanyaan, lalu ketuk satu dari 4 pilihan jawaban untuk nilai yang ditanyakan (biasanya x).
4. Jawaban benar: **+10 poin**, dapat ⭐, dan pintu terbuka.
5. Jawaban salah: **nyawa berkurang 1**. Kamu punya **3 nyawa** di awal.
6. Setiap level berisi 4 pintu (4 soal). Selesaikan Level 5 sebelum nyawa habis untuk menang.
7. Setelah menjawab, baca umpan balik dan penjelasannya (langkah sifat kesetaraan dan pemeriksaan substitusi), lalu tekan tombol **Lanjut**.
8. Di layar selesai, tekan **Bermain Lagi** untuk mengulang atau **Ke Layar Mulai** untuk kembali.

## Level dan Kenaikan Kesulitan

| Level | Materi | Contoh jenis soal |
|---|---|---|
| 1 | x + a = b dan x − a = b | x + 5 = 12, x − 7 = 9 |
| 2 | ax = b dan ax + b = c | 3x = 24, 4x + 5 = 29 |
| 3 | Variabel di dua ruas dan bentuk kurung | 7x + 4 = 3x + 20, 3(x + 4) = 30 |
| 4 | Koefisien negatif dan bentuk pecahan | −3x + 20 = 5, x ÷ 2 + 4 = 10 |
| 5 | Soal cerita PLSV | Umur kakak-adik, harga paket, keliling kebun, tarif ojek |

Total: 5 level × 4 soal = 20 soal. Skor maksimal 200 poin.

## Sistem Skor dan Nyawa

- Jawaban benar: +10 poin, +1 bintang energi.
- Jawaban salah: −1 nyawa, skor tidak berkurang.
- Menang: menyelesaikan Level 5 dengan nyawa tersisa.
- Kalah: nyawa menjadi 0.
- Skor, nyawa, level, dan jumlah bintang selalu terlihat di bagian atas layar permainan.

## Skor Terbaik

Skor terbaik tersimpan otomatis di browser pemain dengan `localStorage` (kunci: `bintangEnergiPLSVTerbaik`). Skor terbaik ditampilkan di layar mulai dan layar selesai, dan diperbarui hanya jika skor baru lebih tinggi. Skor terbaik tersimpan per perangkat/browser, bukan per akun, dan terpisah dari game bilangan bulat Kelas VII.

## Ramah Sentuhan (HP)

Game dirancang responsif: tombol jawaban besar (minimal 64 px), tata letak 2 kolom yang menyesuaikan layar kecil, dan tidak ada aksi yang membutuhkan klik kanan atau keyboard. Keyboard hanya opsional (Enter untuk mulai).

## Suara dan Musik

- Efek suara dan musik latar dibuat dengan **Web Audio API** (disintesis di browser), sehingga game tetap berjalan offline tanpa file audio eksternal.
- Tombol suara di layar mulai dapat mengaktifkan/mematikan suara.
- Referensi suara bebas lisensi: **freesound.org**
- Kredit: Efek suara dalam game ini disintesis mandiri dan terinspirasi dari koleksi bebas lisensi di freesound.org. Jika guru ingin mengganti dengan file audio dari freesound.org, ganti fungsi suara di `script.js` dengan file tersebut dan cantumkan nama pembuat serta lisensinya di sini.

## Struktur File

```
game-bintang-energi-plsv/
├── index.html   # Struktur game: layar mulai, permainan, dan layar selesai
├── style.css    # Tampilan luar angkasa, responsif, dan ramah sentuhan
├── script.js    # Logika game PLSV: soal, level, skor, nyawa, skor terbaik, dan suara
└── README.md    # Dokumen ini
```

Keempat file harus berada dalam satu folder yang sama agar `index.html` dapat memuat `style.css` dan `script.js`.

## Menjalankan Game

- Cara paling mudah: klik dua kali `index.html`, atau buka file tersebut dari browser.
- Tidak memerlukan server, internet, atau instalasi tambahan.
- Jika dibuka dari HP, kirim keempat file dalam satu folder (misalnya lewat ZIP) agar tampilannya tetap utuh.

## Catatan untuk Guru

- Materi dibatasi pada PLSV untuk Kelas VIII, sesuai spesifikasi. Tidak ada materi di luar itu (misalnya tidak ada pertidaksamaan atau sistem persamaan).
- Soal dibuat acak setiap permainan, jadi setiap pengulangan akan berbeda, tetapi tingkat kesulitannya tetap mengikuti level.
- Umpan balik langsung diberikan pada setiap jawaban, beserta penjelasan langkah sifat kesetaraan dan jawaban benarnya.
