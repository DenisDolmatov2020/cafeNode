"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const body_parser_1 = __importDefault(require("body-parser"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const ItemRoutes_1 = __importDefault(require("./routes/ItemRoutes"));
const CategoryRoutes_1 = __importDefault(require("./routes/CategoryRoutes"));
const app = (0, express_1.default)();
const port = 3000;
const cors = require('cors');
// const {secret} = require('./config')
app.use(body_parser_1.default.json());
app.use(cors());
app.use(express_1.default.json());
app.use(express_1.default.static('static'));
app.use('/user', UserRoutes_1.default);
app.use('/item', ItemRoutes_1.default);
app.use('/category', CategoryRoutes_1.default);
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
// Применение middleware для обработки данных формы
app.use(upload.single('image'));
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
