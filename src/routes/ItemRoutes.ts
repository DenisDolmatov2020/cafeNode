import { Router } from 'express';
import ItemController from '../controllers/item.controller';
import userMiddleware from '../middlewares/userMiddleware';

const ItemRoutes: Router = Router();


ItemRoutes.get('/', ItemController.getAll);
ItemRoutes.get('/:categoryId', ItemController.getItemsByCategory);
ItemRoutes.post('/', userMiddleware, ItemController.createItem);
ItemRoutes.patch('/:id', userMiddleware, ItemController.updateItem);


export default ItemRoutes;
