import { storage } from "../config/config";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Request } from "express";
import { v4 as uuidv4 } from 'uuid';

interface ImageUrls {
  imgUrls: string[];
  bannerUrl: string | null;
}
async function guardarImagenes(req: Request): Promise<ImageUrls> {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[]; };
    const imgFiles = files['img'] || [];
    const bannerFiles = files['banner'] || [];

    // Lógica para subir las imágenes a la nube y tomar sus URLs
    const imgUrls = await Promise.all(imgFiles.map(async (file) => {
      const uniqueFileName = uuidv4() + '-' + file.originalname;
      const storageRef = ref(storage, uniqueFileName);

      await uploadBytes(storageRef, file.buffer, { contentType: file.mimetype });

      const url = await getDownloadURL(storageRef);
      return url;
    }));

    // Lógica para subir los banners a la nube y tomar sus URLs
    let bannerUrl: string | null = null;
    if (bannerFiles.length > 0) {
      const bannerFile = bannerFiles[0];
      const uniqueFileName = uuidv4() + '-' + bannerFile.originalname;
      const storageRef = ref(storage, uniqueFileName);

      await uploadBytes(storageRef, bannerFile.buffer, { contentType: bannerFile.mimetype });

      bannerUrl = await getDownloadURL(storageRef);
    }

    return { imgUrls, bannerUrl };
  } catch (error) {
    console.error('Error al guardar las imágenes:', error);
    throw error;
  }
}

async function deleteImage(imagePath: string): Promise<void> {
  const imageRef = ref(storage, imagePath);

  try {
      await deleteObject(imageRef);
  } catch (error) {
      throw error;
  }
}


export { guardarImagenes,deleteImage};
