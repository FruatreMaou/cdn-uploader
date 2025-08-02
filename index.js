const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const port = 3000;

function cleanOldFiles(dir, maxAgeMs = 24 * 60 * 60 * 1000) {
  fs.readdir(dir, (err, files) => {
    if (err) return console.error("Gagal baca folder tmp:", err);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return;
        const now = Date.now();
        const modified = new Date(stats.mtime).getTime();
        if (now - modified > maxAgeMs) {
          fs.unlink(filePath, (err) => {
            if (!err) {
              console.log(`🗑️  File dihapus karena lewat 24 jam: ${file}`);
            }
          });
        }
      });
    });
  });
}

app.use(fileUpload());
app.use("/tmp", express.static(path.join(__dirname, "tmp"))); // 🔁 akses file statik

// pastikan folder tmp ada
const tmpDir = path.join(__dirname, "tmp");
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

// halaman upload form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// handle upload
app.post("/upload", async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send("❌ Tidak ada file diupload.");
  }

  const MIN_SIZE = 10 * 1024; // 10 KB
  const MAX_SIZE = 100 * 1024 * 1024; // 100 MB
  let files = req.files.file;

  // Ubah jadi array jika hanya 1 file
  if (!Array.isArray(files)) files = [files];

  // ❌ Cek ukuran file
  const tooSmall = files.filter((f) => f.size < MIN_SIZE);
  const tooBig = files.filter((f) => f.size > MAX_SIZE);

  if (tooSmall.length > 0) {
    return res
      .status(400)
      .send(`❌ File terlalu kecil (<10KB): ${tooSmall.map((f) => f.name).join(", ")}`);
  }

  if (tooBig.length > 0) {
    return res
      .status(400)
      .send(`❌ File terlalu besar (>100MB): ${tooBig.map((f) => f.name).join(", ")}`);
  }

  try {
    const uploaded = [];

    for (const file of files) {
      const ext = path.extname(file.name);
      const randomName = crypto.randomBytes(6).toString("hex") + ext;
      const uploadPath = path.join(tmpDir, randomName);

      await file.mv(uploadPath);
      uploaded.push(`https://cdn-up.fruatrecard.my.id/tmp/${randomName}`);
    }

    // Redirect to main page with success message and URL
    res.redirect(`/?success=true&url=${encodeURIComponent(uploaded[0])}`);
  } catch (err) {
    console.error(err);
    return res.status(500).send("❌ Upload gagal. Silakan coba lagi nanti");
  }
});

// ✅ GET /files — tampilkan semua file di folder tmp
app.get("/files", (req, res) => {
  fs.readdir(tmpDir, (err, files) => {
    if (err) return res.status(500).send("Gagal membaca folder.");

    const list = files.map((file) => ({
      name: file,
      url: `https://cdn-up.fruatrecard.my.id/tmp/${file}`,
    }));

    res.json({
      count: list.length,
      files: list,
    });
  });
});

// ✅ GET /clean-now — trigger bersih manual
app.get("/clean-now", (req, res) => {
  cleanOldFiles(tmpDir);
  res.send("🔁 Pembersihan dimulai di latar belakang.");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Jalankan pengecekan setiap 30 menit
setInterval(() => cleanOldFiles(tmpDir), 30 * 60 * 1000);

// Jalankan sekali saat server start
cleanOldFiles(tmpDir);


