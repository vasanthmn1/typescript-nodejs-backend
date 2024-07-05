import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Configure multer for file uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
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


app.get("/", (req: Request, res: Response) => {
    res.send("+ TypeScript Server");
});


app.use('/',)

app.post("/file", upload.single('image'), (req: Request, res: Response) => {
    const file = req.file;
    console.log(file);

    if (!file) {
        return res.status(400).send("No file uploaded.");
    }

    console.log(`Received file: ${file.originalname}`);
    console.log(`File size: ${file.size} bytes`);

    // You can process the file here (e.g., save it to disk, upload to cloud storage, etc.)

    res.send(`File received: ${file.originalname}`);
});


app.listen(port, () => {
    console.log(`[server]: Server  http://localhost:${port}`);
});
