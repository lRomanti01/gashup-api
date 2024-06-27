import { storage } from "../config/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Request } from "express";

interface ImageUrls {
  imgUrls: string[];
  bannerUrl: string | null;
}
async function guardarImagenes(req: Request): Promise<ImageUrls> {
  try {
    const files = req.files as {[fieldname: string]: Express.Multer.File[];};
    const imgFiles = files['img'] || [];
    const bannerFiles = files['banner'] || [];

    //logica para subir las imagenes a la nube y tomar sus url
    const imgUrls = await Promise.all(imgFiles.map(async (file) => 
      {
        const fileName = file.originalname;
        const storageRef = ref(storage, fileName);

        await uploadBytes(storageRef, file.buffer, {contentType: file.mimetype});

        const url = await getDownloadURL(storageRef);
        return url;
      }));

    //logica para subir los banner a la nube y tomar sus url
    let bannerUrl: string | null = null;
    if (bannerFiles.length > 0) {
      const bannerFile = bannerFiles[0];
      const fileName = bannerFile.originalname;
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, bannerFile.buffer, {contentType: bannerFile.mimetype});

      bannerUrl = await getDownloadURL(storageRef);
    }

    return { imgUrls, bannerUrl };
  } catch (error) {
    console.error('Error al guardar las imágenes:', error);
    throw error;
  }
}

export { guardarImagenes};
