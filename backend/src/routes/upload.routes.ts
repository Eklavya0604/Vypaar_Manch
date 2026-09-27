import { Router } from 'express';
import { uploadImage } from '../controllers/upload.controller';
import multer from 'multer';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  }
});

router.post('/', upload.single('file'), uploadImage);

export default router;
