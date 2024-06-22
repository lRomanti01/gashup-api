import { storage } from '../config/config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Request } from 'express';

async function guardarImagenes(req: Request): Promise<string[]> {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      throw new Error('No se encontraron archivos para cargar');
    }

    const files = req.files;
    const urls = await Promise.all(files.map(async (file) => {
      const fileName = file.originalname;
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, file.buffer, {
        contentType: file.mimetype
      });

      const url = await getDownloadURL(storageRef);
      return url;
    }));

    return urls;
  } catch (error) {
    console.error('Error al guardar las imágenes:', error);
    throw error;
  }
}
export { guardarImagenes};
