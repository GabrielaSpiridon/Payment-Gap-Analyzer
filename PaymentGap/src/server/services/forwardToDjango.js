import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export const forwardToDjango = async (filePath) => {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  return await axios.post('http://localhost:8000/api/upload-excel/', form, {
    headers: form.getHeaders()
  });
};
