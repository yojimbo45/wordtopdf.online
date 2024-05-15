onst accountId = '0585b09f80d8486475ba222e78488857';
const r2Token = 'A2zjQNWbkleHyWSVphxeNatiURxO0ja_qZTw55dS';
const s3Endpoint = 'https://0585b09f80d8486475ba222e78488857.r2.cloudflarestorage.com/my-upload-worker';
const api2pdfApiKey = '9ab70c24-9831-4fce-aa30-7c0267af4eda';

// Function to upload file to Cloudflare R2 bucket
async function uploadFileToR2(formData) {
    try {
        const response = await fetch(s3Endpoint, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': r2Token
            }
        });
        if (!response.ok) {
            throw new Error('Failed to upload file to R2 bucket');
        }
        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error('Error uploading file to R2 bucket:', error);
        throw error;
    }
}
  

// Функция для конвертации файла в PDF с помощью API2PDF
function convertToPdf(fileUrl) {
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function() {
    if (this.readyState === 4) {
      if (this.status === 200) {
        console.log('PDF conversion response:', this.responseText);
        // Здесь вы можете обрабатывать ответ, например, сохранить PDF или отобразить его в браузере
      } else {
        console.error('Произошла ошибка при конвертации в PDF');
      }
    }
  });

  const apiUrl = `https://v2.api2pdf.com/chrome/pdf/url?url=${encodeURIComponent(fileUrl)}&apikey=${api2pdfApiKey}`;
  xhr.open("GET", apiUrl);
  xhr.send();
}

// Пример использования функций
// const filePath = 'ПУТЬ_К_ВАШЕМУ_ДОКУМЕНТУ'; // Укажите путь к вашему документу
// uploadFileToS3(filePath)
//   .then(convertToPdf)
//   .catch(error => {
//     // Обработка ошибок
//     console.error(error);
//   });
