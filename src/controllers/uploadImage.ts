import { storage } from '../config/config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Request } from 'express';

async function guardarImagen(req: Request): Promise<string | null> {
  try {
    const file = req.file;

    const fileName = file.originalname;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, file.buffer, {
      contentType: file.mimetype
    });

    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Error al guardar la imagen:', error);
    throw null;
  }
}

export { guardarImagen};
