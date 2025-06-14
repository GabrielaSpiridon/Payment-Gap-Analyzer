import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

export const forwardToDjango = async (filePath, originalName) => {
  const form = new FormData();

  form.append('file', fs.createReadStream(filePath), {
    filename: originalName,
    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  return await axios.post('http://localhost:8000/api/upload-excel/', form, {
    headers: form.getHeaders()
  });
};
