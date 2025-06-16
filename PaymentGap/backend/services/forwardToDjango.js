import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

export const forwardToDjango = async (filePaths) => {
  const form = new FormData();

  for (const filePath of filePaths) {
    const fileName = path.basename(filePath);
    form.append('files', fs.createReadStream(filePath), {
      filename: fileName,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
  }

  return await axios.post('http://localhost:8000/api/upload-excel/', form, {
    headers: form.getHeaders()
  });
};
