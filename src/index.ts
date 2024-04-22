// src/index.ts
import express from 'express';
import multer from 'multer';
import bodyParser from 'body-parser';
import UserRoutes from './routes/UserRoutes';
import ItemRoutes from './routes/ItemRoutes';
import CategoryRoutes from './routes/CategoryRoutes';

const app = express();
const port = 3000;

const cors = require('cors')
// const {secret} = require('./config')


app.use(bodyParser.json());
app.use(cors())
app.use(express.json());
app.use(express.static('static'));

app.use('/user', UserRoutes);
app.use('/item', ItemRoutes);
app.use('/category', CategoryRoutes);


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Применение middleware для обработки данных формы
app.use(upload.single('image'));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
