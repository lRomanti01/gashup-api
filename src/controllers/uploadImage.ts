import { storage } from "../config/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Request } from "express";

interface ImageUrls {
  imgUrls: string[];
  bannerUrl: string | null;
}

async function guardarImagenes(req: Request): Promise<ImageUrls> {
  try {
    if (!req.files) {
      throw new Error('No se encontraron archivos para cargar');
    }

    const imgFiles = req.files['img'];
    const bannerFile = req.files['banner'];

    const imgUrls = await Promise.all(imgFiles.map(async (file) => {
      const fileName = file.originalname;
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, file.buffer, {
        contentType: file.mimetype
      });

      const url = await getDownloadURL(storageRef);
      return url;
    }));

    let bannerUrl: string | null = null;
    if (bannerFile) {
      const fileName = bannerFile.originalname;
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, bannerFile.buffer, {
        contentType: bannerFile.mimetype
      });

      bannerUrl = await getDownloadURL(storageRef);
    }

    return { imgUrls, bannerUrl };
  } catch (error) {
    console.error('Error al guardar las imágenes:', error);
    throw error;
  }
}

export { guardarImagenes };