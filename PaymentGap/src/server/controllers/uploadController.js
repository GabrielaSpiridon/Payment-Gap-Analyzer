import path from 'path';
import { forwardToDjango } from '../services/forwardToDjango.js';

export const uploadExcel = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Niciun fisier nu a fost incarcat.' });
  }

  try {
    const filePath = path.resolve(req.file.path);
    const response = await forwardToDjango(filePath);
    res.status(200).json({ message: 'Upload trimis la Django.', djangoResponse: response.data });
  } catch (error) {
    console.error('Eroare la trimitere către Django:', error.message);
    res.status(500).json({ message: 'Eroare la procesare fisier in Django.' });
  }
};
