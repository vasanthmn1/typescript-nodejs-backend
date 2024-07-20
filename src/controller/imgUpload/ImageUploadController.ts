import { Request, Response } from "express"
import multer from "multer";
import { ImageUploadUtils } from "../../utils/img_uplaod_utils";



export class ImageController {

    uploadImage = (req: Request, res: Response) => {
        const upload = multer({ storage: ImageUploadUtils.storage });

        upload.single('image')
        const file = req.file;
        console.log(file);

        if (!file) {
            return res.status(400).send("No file uploaded.");
        }

        console.log(`Received file: ${file.originalname}`);
        console.log(`File size: ${file.size} bytes`);

        res.send(`File received: ${file.originalname}`);
    }

}   