import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() }).fields([
    { name: 'img'}, 
    { name: 'banner', maxCount: 1 } 
  ]);

export { upload };
