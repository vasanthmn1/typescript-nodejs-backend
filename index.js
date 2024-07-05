"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Configure multer for file uploads
const uploadDir = path_1.default.join(__dirname, 'uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir);
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
        cb(null, filename);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
app.get("/", (req, res) => {
    res.send("+ TypeScript Server");
});
app.use('/');
app.post("/file", upload.single('image'), (req, res) => {
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
