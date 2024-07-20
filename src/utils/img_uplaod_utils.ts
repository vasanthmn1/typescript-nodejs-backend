import multer from "multer";
import path from "path";


export class ImageUploadUtils {

    static uploadDir = path.join(__dirname, 'uploads')

    static storage = multer.diskStorage({
        // 

        destination: (req, file, cb) => {
            cb(null, this.uploadDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
            cb(null, filename);
        }
    });

}