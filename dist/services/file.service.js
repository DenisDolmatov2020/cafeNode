"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const node_path_1 = __importDefault(require("node:path"));
const multer_1 = __importDefault(require("multer"));
const promises_1 = __importDefault(require("fs/promises"));
class FileService {
    async saveFile(req, res) {
        try {
            FileService.upload(req, res, async (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Error uploading file' });
                }
                const fileName = req.file.filename;
                const filePath = node_path_1.default.join('static', fileName);
                // Прочитайте файл в виде буфера
                const fileBuffer = await promises_1.default.readFile(filePath);
                // Отправьте бинарные данные вместе с другими данными на сервер
                // Например, используя axios
                // const response = await axios.post('/api/createItem', { image: fileBuffer, ...otherData });
                // Удалите файл после чтения
                await promises_1.default.unlink(filePath);
                return res.status(200).json({ message: 'File uploaded successfully', fileName });
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error uploading file' });
        }
    }
}
FileService.storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'static'); // Путь куда сохранять файлы
    },
    filename: (req, file, cb) => {
        const fileName = (0, uuid_1.v4)() + node_path_1.default.extname(file.originalname);
        cb(null, fileName);
    },
});
FileService.upload = (0, multer_1.default)({ storage: FileService.storage }).single('image');
exports.default = new FileService();
