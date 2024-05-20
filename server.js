const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const fetch = require('node-fetch');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const iconv = require('iconv-lite');
const stream = require('stream');

require('dotenv').config(); 

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

async function uploadFileToCloudflare(filePath, originalName, fileSize, fileData, type) {
  try {
    const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY;
    const secretAccessKey = process.env.CLOUDFLARE_SECRET_KEY;
    const region = process.env.CLOUDFLARE_REGION;
    const service = 's3';

    const currentDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');

    const url = `https://c320a6f0c79e03c4d58d689aead26318.r2.cloudflarestorage.com/world-to-pdf/${encodeURIComponent(originalName)}`;

    function signRequest(accessKey, secretKey, region, service, date, payload) {
      const kDate = crypto.createHmac('sha256', `AWS4${secretKey}`).update(date.substr(0, 8)).digest();
      const kRegion = crypto.createHmac('sha256', kDate).update(region).digest();
      const kService = crypto.createHmac('sha256', kRegion).update(service).digest();
      const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();

      const canonicalRequest = [
        'PUT',
        `/world-to-pdf/${encodeURIComponent(originalName)}`,
        '',
        `content-length:${fileSize}`,
        `content-type:${type}`,
        `host:c320a6f0c79e03c4d58d689aead26318.r2.cloudflarestorage.com`,
        `x-amz-content-sha256:${crypto.createHash('sha256').update(payload).digest('hex')}`,
        `x-amz-date:${date}`,
        '',
        'content-length;content-type;host;x-amz-content-sha256;x-amz-date',
        crypto.createHash('sha256').update(payload).digest('hex')
      ].join('\n');

      const stringToSign = [
        'AWS4-HMAC-SHA256',
        date,
        `${date.substr(0, 8)}/${region}/${service}/aws4_request`,
        crypto.createHash('sha256').update(canonicalRequest).digest('hex')
      ].join('\n');

      const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

      return {
        Authorization: `AWS4-HMAC-SHA256 Credential=${accessKey}/${date.substr(0, 8)}/${region}/${service}/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=${signature}`,
        'x-amz-content-sha256': crypto.createHash('sha256').update(payload).digest('hex'),
        'x-amz-date': date,
      };
    }

    const signedHeaders = signRequest(accessKeyId, secretAccessKey, region, service, currentDate, fileData);

    const cloudflareResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        ...signedHeaders,
        'Content-Length': fileSize,
        'Content-Type': type, 
        'User-Agent': 'Mozilla/5.0',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
      },
      body: fileData,
    });

    console.log('Cloudflare response status:', cloudflareResponse.status);

    if (!cloudflareResponse.ok) {
      const responseText = await cloudflareResponse.text();
      console.error('Failed to upload file to Cloudflare:', responseText);
      return { success: false, error: responseText };
    }

    return { success: true, url: url };
  } catch (error) {
    console.error('Error during file upload:', error);
    return { success: false, error: 'Internal Server Error' };
  }
}

app.put('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    console.log('Received file:', file);

    if (!file) {
      console.error('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = path.join(__dirname, 'uploads', file.filename);
    const fileData = fs.readFileSync(filePath);
    const originalName = iconv.decode(Buffer.from(file.originalname, 'binary'), 'utf-8');

    const uploadResult = await uploadFileToCloudflare(filePath, originalName, file.size, fileData, file.mimetype);

    if (!uploadResult.success) {
      return res.status(500).json({ error: uploadResult.error });
    }

    res.status(200).json({
      message: 'File uploaded successfully',
      fileName: originalName,
      size: file.size,
      url: uploadResult.url,
    });
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/convertToPdf', upload.single('file'), async (req, res) => {
  try {
    const filename = req.body.fileName;
    console.log('Received file:', filename);

    const apiUrl = 'https://v2.api2pdf.com/libreoffice/any-to-pdf';
    const apiKey = process.env.API2PDF_API_KEY;

    const fileUrl = `https://pub-5c6624c350d345ac98aa81a1727763f9.r2.dev/${filename}`;

    const requestData = {
      url: fileUrl,
      "inline": true,
      "fileName": `${filename}.pdf`,
      "extraHTTPHeaders": {},
      "useCustomStorage": false,
      "storage": {
        "method": "PUT",
        "url": "https://presignedurl",
        "extraHTTPHeaders": {}
      }
    };

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey,
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (apiResponse.ok) {
      const apiResponseData = await apiResponse.json();
      console.log('Conversion API response:', apiResponseData);

      const pdfFileUrl = apiResponseData.FileUrl;

      const pdfResponse = await fetch(pdfFileUrl);
      const pdfBuffer = await pdfResponse.buffer();

      const pdfFileName = `${filename}.pdf`;
      const pdfFilePath = path.join(__dirname, 'uploads', pdfFileName);

      fs.writeFileSync(pdfFilePath, pdfBuffer);

      const uploadResult = await uploadFileToCloudflare(pdfFilePath, pdfFileName, pdfBuffer.length, pdfBuffer, "application/pdf");

      console.log('Uploaded file:', pdfFileName);

      fs.unlinkSync(pdfFilePath);

      res.status(200).json({
        message: 'File converted and uploaded to Cloudflare successfully',
        fileName: pdfFileName,
        size: pdfBuffer.length,
        url: uploadResult.url,
      });
    } else {
      const errorText = await apiResponse.text();
      console.error('Error response from API2PDF:', apiResponse.status, errorText);
      return res.status(apiResponse.status).json({ error: errorText });
    }
  } catch (error) {
    console.error('Error during conversion:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

