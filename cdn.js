// 📁 (CJS Version)

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { fileTypeFromBuffer } = require('file-type');
const { randomBytes } = require('crypto');
const fetch = require('node-fetch');
const { HttpsProxyAgent } = require('https-proxy-agent');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Safari/605.1.15',
  'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.145 Mobile Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile Safari/604.1'
];

const proxies = [
  'http://jlxbwiya:0b2558gm3crl@173.0.9.70:5653',
  'http://jlxbwiya:0b2558gm3crl@104.239.105.125:6655',
  'http://jlxbwiya:0b2558gm3crl@64.64.118.149:6732',
  'http://jlxbwiya:0b2558gm3crl@136.0.207.84:6661',
  'http://jlxbwiya:0b2558gm3crl@142.147.128.93:6593',
  'http://jlxbwiya:0b2558gm3crl@216.10.27.159:6837',
  'http://jlxbwiya:0b2558gm3crl@23.94.138.75:6349',
  'http://jlxbwiya:0b2558gm3crl@207.244.217.165:6712',
  'http://jlxbwiya:0b2558gm3crl@107.172.163.27:6543',
  'http://jlxbwiya:0b2558gm3crl@198.23.239.134:6540'
];

const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
axios.defaults.headers.common['User-Agent'] = userAgent;

const proxy = proxies[Math.floor(Math.random() * proxies.length)];
const agent = new HttpsProxyAgent(proxy);

function writeTemp(buffer) {
  const tmp = './tmp-' + Date.now();
  fs.writeFileSync(tmp, buffer);
  return tmp;
}

async function uploadUguu(buffer) {
  const tmp = writeTemp(buffer);
  const f = new FormData();
  f.append('files[]', fs.createReadStream(tmp));
  const res = await axios.post('https://uguu.se/upload.php', f, { headers: f.getHeaders() });
  fs.unlinkSync(tmp);
  return res.data.files[0].url;
}

async function uploadLitter(buffer) {
  const tmp = writeTemp(buffer);
  const f = new FormData();
  f.append('reqtype', 'fileupload');
  f.append('time', '24h');
  f.append('fileToUpload', fs.createReadStream(tmp));
  const { data } = await axios.post('https://litterbox.catbox.moe/resources/internals/api.php', f, { headers: f.getHeaders() });
  fs.unlinkSync(tmp);
  return data;
}

async function uploadGoFile(buffer) {
  const tmp = writeTemp(buffer);
  const f = new FormData();
  f.append('file', fs.createReadStream(tmp));
  const res = await axios.post('https://upload.gofile.io/uploadFile', f, {
    headers: f.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  });
  fs.unlinkSync(tmp);
  if (res.data.status !== 'ok') throw new Error();
  return res.data.data.downloadPage;
}

async function uploadPixeldrain(buffer) {
  const tmp = writeTemp(buffer);
  const key = '3e3790a8-e349-455f-a9f2-1605387a6490';
  const auth = Buffer.from(':' + key).toString('base64');
  const f = new FormData();
  f.append('file', fs.createReadStream(tmp));
  const res = await axios.post('https://pixeldrain.com/api/file', f, {
    headers: {
      ...f.getHeaders(),
      Authorization: `Basic ${auth}`,
      'User-Agent': userAgent
    },
    maxBodyLength: Infinity
  });
  fs.unlinkSync(tmp);
  return `https://pixeldrain.com/u/${res.data.id}`;
}

async function uploadCDNCare(buffer) {
  const { ext, mime } = await fileTypeFromBuffer(buffer);
  const name = `${randomBytes(3).toString('hex')}.${ext}`;
  const f = new FormData();
  f.append('file', buffer, { filename: name, contentType: mime });
  f.append('UPLOADCARE_PUB_KEY', 'demopublickey');
  f.append('UPLOADCARE_STORE', '1');
  const res = await fetch('https://upload.uploadcare.com/base/', {
    method: 'POST',
    body: f,
    headers: f.getHeaders()
  });
  const j = await res.json();
  return `https://ucarecdn.com/${j.file}/${name}`;
}

async function uploadPutIcu(buffer) {
  const res = await fetch('https://put.icu/upload/', {
    method: 'PUT',
    body: buffer,
    headers: {
      'User-Agent': userAgent,
      'Accept': 'application/json'
    }
  });
  const j = await res.json();
  return j.direct_url;
}

async function upload0x0(buffer) {
  const { ext } = await fileTypeFromBuffer(buffer) || { ext: 'bin' };
  const filename = `upload.${ext}`;
  const form = new FormData();
  form.append('file', buffer, filename);
  const res = await fetch('https://0x0.st', {
    method: 'POST',
    body: form,
    headers: {
      ...form.getHeaders(),
      'User-Agent': 'curl/7.68.0'
    },
    agent
  });
  const text = await res.text();
  if (!res.ok || !text.startsWith('https://0x0.st/')) throw new Error('Upload failed');
  return text.trim();
}

const uploaders = [
  uploadUguu,
  uploadLitter,
  uploadGoFile,
  uploadPixeldrain,
  uploadCDNCare,
  uploadPutIcu,
  upload0x0
];

module.exports = {
  uploadUguu,
  uploadLitter,
  uploadGoFile,
  uploadPixeldrain,
  uploadCDNCare,
  uploadPutIcu,
  upload0x0,
  uploaders
};
