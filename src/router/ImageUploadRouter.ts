

import express from 'express'
import { ImageController } from '../controller/imgUpload/ImageUploadController';


const router = express.Router();

let imageController = new ImageController()


router.post('upload', imageController.uploadImage)


export default router