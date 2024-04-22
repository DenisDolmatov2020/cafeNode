import { v4 as uuidv4 } from 'uuid';
import path from 'node:path';
import multer from 'multer';
import fs from 'fs/promises';


class FileService {
    private static storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'static'); // Путь куда сохранять файлы
        },
        filename: (req, file, cb) => {
            const fileName = uuidv4() + path.extname(file.originalname);
            cb(null, fileName);
        },
    });

    private static upload = multer({ storage: FileService.storage }).single('image');

    async saveFile(req: any, res: any) {
        try {
            FileService.upload(req, res, async (err: any) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Error uploading file' });
                }

                const fileName = req.file.filename;
                const filePath = path.join('static', fileName);

                // Прочитайте файл в виде буфера
                const fileBuffer = await fs.readFile(filePath);

                // Отправьте бинарные данные вместе с другими данными на сервер
                // Например, используя axios
                // const response = await axios.post('/api/createItem', { image: fileBuffer, ...otherData });

                // Удалите файл после чтения
                await fs.unlink(filePath);

                return res.status(200).json({ message: 'File uploaded successfully', fileName });
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error uploading file' });
        }
    }
}

export default new FileService();

