"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ImageUploadController_1 = require("../controller/imgUpload/ImageUploadController");
const router = express_1.default.Router();
let imageController = new ImageUploadController_1.ImageController();
router.post('upload', imageController.uploadImage);
exports.default = router;
