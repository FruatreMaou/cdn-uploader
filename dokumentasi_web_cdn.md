# Dokumentasi Web CDN GitHub

## Deskripsi
Web CDN ini adalah aplikasi web yang memungkinkan pengguna untuk mengunggah file ke repository GitHub dan mendapatkan URL CDN langsung untuk mengakses file tersebut. Aplikasi ini menggunakan GitHub sebagai penyimpanan file dan GitHub Raw sebagai CDN.

## Fitur
- Upload file melalui antarmuka web yang mudah digunakan
- Otomatis menghasilkan nama file unik dengan timestamp
- Mendukung berbagai jenis file
- Memberikan URL CDN langsung setelah upload berhasil
- Antarmuka yang responsif dan menarik dengan animasi

## Teknologi yang Digunakan
- **Backend**: Node.js dengan Express.js
- **Frontend**: HTML, CSS (Tailwind CSS), JavaScript
- **Storage**: GitHub Repository
- **CDN**: GitHub Raw

## Konfigurasi

### Repository GitHub
- **Owner**: FruatreMaou
- **Repository**: FruatreCdn
- **Branch**: main
- **Folder Upload**: uploads/

### Token GitHub
Aplikasi menggunakan GitHub Personal Access Token dengan permission:
- repo (full control of private repositories)

## Cara Penggunaan

### 1. Menjalankan Aplikasi Lokal
```bash
cd web-uploadfile-to-github
npm install
npm start
```

Aplikasi akan berjalan di `http://localhost:3000`

### 2. Menggunakan Web Interface
1. Buka aplikasi di browser
2. Klik tombol "Choose File" untuk memilih file
3. Klik tombol "Upload File" untuk mengunggah
4. Setelah berhasil, akan muncul halaman dengan URL CDN
5. Klik tombol "Salin URL" untuk menyalin URL ke clipboard

### 3. Menggunakan API (curl)
```bash
curl -X POST -F "file=@path/to/your/file.txt" http://localhost:3000/upload
```

## Struktur File yang Diunggah
File yang diunggah akan disimpan dengan format:
```
uploads/[timestamp].[extension]
```

Contoh: `uploads/1753840327960.txt`

## URL CDN
Setelah file berhasil diunggah, URL CDN akan mengikuti format:
```
https://raw.githubusercontent.com/FruatreMaou/FruatreCdn/main/uploads/[filename]
```

## Keamanan
- Menggunakan GitHub Personal Access Token untuk autentikasi
- File diunggah ke repository publik (dapat diakses siapa saja)
- Nama file menggunakan timestamp untuk menghindari konflik

## Batasan
- Ukuran file dibatasi oleh GitHub (maksimal 100MB per file)
- Repository GitHub memiliki batasan storage
- File yang diunggah akan bersifat publik

## Troubleshooting

### Error 403: Resource not accessible by personal access token
- Pastikan token GitHub memiliki permission yang tepat
- Pastikan token masih valid dan belum expired

### Error 400: No files were uploaded
- Pastikan file dipilih sebelum mengklik upload
- Pastikan request menggunakan multipart/form-data

### Server tidak dapat diakses
- Pastikan aplikasi Node.js sedang berjalan
- Periksa port 3000 tidak digunakan aplikasi lain

