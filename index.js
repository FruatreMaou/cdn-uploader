const express = require('express');
const fileUpload = require('express-fileupload');
const { uploaders } = require('./cdn.js');

const app = express();
const port = 3000;

app.use(fileUpload());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/upload', async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send('Tidak ada file yang diupload.');
  }

  const buffer = req.files.file.data;

  let url = null;
  let errorLog = [];

  for (let upload of uploaders) {
    try {
      url = await upload(buffer);
      break;
    } catch (e) {
      errorLog.push(e.message);
    }
  }

  if (!url) {
    return res.status(500).send('Upload gagal di semua uploader:\n' + errorLog.join('\n'));
  }

  res.send(showSuccessHTML(url));
});

    function showSuccessHTML(url) {
    return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload Berhasil - CDN</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="icon" type="image/x-icon" href="https://i.pinimg.com/736x/0d/71/2a/0d712a0b6805c0b44386339048bdfce5.jpg?format=png&name=900x900">
    <script>
        tailwind.config = {
        theme: {
            extend: {
            fontFamily: {
                'poppins': ['Poppins', 'sans-serif'],
                'opensans': ['Open Sans', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-slow': 'bounce 2s infinite',
                'fade-in': 'fadeIn 0.8s ease-out',
                'slide-up': 'slideUp 0.6s ease-out',
                'scale-in': 'scaleIn 0.5s ease-out',
                'success-pop': 'successPop 0.6s ease-out',
            },
            keyframes: {
                float: {
                '0%, 100%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-20px)' },
                },
                fadeIn: {
                '0%': { opacity: '0' },
                '100%': { opacity: '1' },
                },
                slideUp: {
                '0%': { transform: 'translateY(30px)', opacity: '0' },
                '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                '0%': { transform: 'scale(0.9)', opacity: '0' },
                '100%': { transform: 'scale(1)', opacity: '1' },
                },
                successPop: {
                '0%': { transform: 'scale(0)', opacity: '0' },
                '50%': { transform: 'scale(1.1)', opacity: '1' },
                '100%': { transform: 'scale(1)', opacity: '1' },
                }
            }
            }
        }
        }
    </script>
    <style>
        body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
        background-size: 400% 400%;
        animation: gradientShift 15s ease infinite;
        font-family: 'Open Sans', sans-serif;
        }

        @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
        }

        .glass-card {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 
            0 25px 45px rgba(0, 0, 0, 0.1),
            0 0 60px rgba(16, 185, 129, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .glass-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 
            0 35px 60px rgba(0, 0, 0, 0.15),
            0 0 80px rgba(16, 185, 129, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }

        .btn-success {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        position: relative;
        overflow: hidden;
        }

        .btn-success::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        transition: left 0.5s;
        }

        .btn-success:hover::before {
        left: 100%;
        }

        .success-checkmark {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: linear-gradient(135deg, #10b981, #059669);
        position: relative;
        margin: 0 auto 20px;
        animation: success-pop 0.6s ease-out;
        box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
        }

        .success-checkmark::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 40px;
        font-weight: bold;
        }

        .url-container {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        }

        @media (max-width: 640px) {
        .glass-card {
            margin: 1rem;
            padding: 1.5rem;
        }
        }
    </style>
    </head>
    <body class="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
    <div class="success-checkmark mb-6"></div>

    <div class="glass-card rounded-3xl p-8 md:p-10 w-full max-w-2xl transition-all duration-500 ease-out animate-scale-in">
        <div class="text-center mb-8">
        <h1 class="text-4xl md:text-5xl font-poppins font-bold text-white mb-4 drop-shadow-lg">
            Upload Berhasil! 🎉
        </h1>
        <p class="text-lg md:text-xl font-opensans text-white/90 leading-relaxed">
            File Anda telah berhasil diunggah. Berikut adalah URL langsung untuk mengakses file:
        </p>
        </div>

        <div class="url-container rounded-2xl p-6 mb-8 break-all">
        <div class="flex items-center justify-between mb-4">
            <span class="text-white/80 font-opensans text-sm uppercase tracking-wide">URL CDN Anda:</span>
            <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        </div>
        <a id="rawUrlLink" href="${url}" 
            class="text-white font-poppins font-medium text-lg hover:text-green-300 transition duration-200 ease-in-out block"
            target="_blank" rel="noopener noreferrer">
            ${url}
        </a>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button onclick="copyUrl(event)" 
                class="btn-success flex-1 py-4 px-8 rounded-2xl text-white font-poppins font-semibold text-lg
                        transform transition-all duration-300 ease-out
                        hover:scale-105 hover:shadow-2xl
                        focus:outline-none focus:ring-4 focus:ring-green-300/50">
            <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            Salin URL
        </button>

        <a href="/" 
            class="flex-1 py-4 px-8 rounded-2xl text-white font-poppins font-semibold text-lg text-center
                    bg-white/10 border border-white/20 backdrop-blur-sm
                    transform transition-all duration-300 ease-out
                    hover:scale-105 hover:bg-white/20 hover:shadow-2xl
                    focus:outline-none focus:ring-4 focus:ring-white/30">
            Upload Lagi
        </a>
        </div>
    </div>

    <footer class="mt-8 text-center animate-slide-up">
        <p class="text-white/60 font-opensans text-sm">
        File berhasil disimpan • Bisa Diakses kapan saja, di mana saja
        </p>
    </footer>

    <script>
        function copyUrl(event) {
        const rawUrl = document.getElementById('rawUrlLink').href;
        navigator.clipboard.writeText(rawUrl).then(function () {
            const button = event.target.closest('button');
            const originalText = button.innerHTML;

            button.innerHTML = \`
            <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Tersalin!
            \`.trim();

            button.style.background = 'linear-gradient(135deg, #059669, #047857)';

            setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            }, 2000);
        }).catch(function (error) {
            alert("Gagal menyalin URL: " + error);
        });
        }

        document.addEventListener('mousemove', function(e) {
        const cards = document.querySelectorAll('.glass-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = \`perspective(1000px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg) translateY(-8px) scale(1.02)\`;
            } else {
            card.style.transform = '';
            }
        });
        });
    </script>
    </body>
    </html>
  `.trim();
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
