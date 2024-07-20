

import express from 'express'
import { ImageController } from '../controller/imgUpload/ImageUploadController';
import multer from 'multer';
import path from 'path';


const router = express.Router();

let imageController = new ImageController()


const uploadDir = path.join(__dirname, 'uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
        cb(null, filename);
    }
});



const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), imageController.uploadImage)


export default router