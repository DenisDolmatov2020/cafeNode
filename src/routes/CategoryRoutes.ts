import { Router } from 'express';
import CategoryController from '../controllers/category.controller';
import userMiddleware from '../middlewares/userMiddleware';

const CategoryRouter: Router = Router();


CategoryRouter.get('/tree', CategoryController.getAllCategoriesWithItems);
CategoryRouter.get('/', CategoryController.getAll);
CategoryRouter.get('/:parentCategoryId', CategoryController.getCategories);
CategoryRouter.post('/', userMiddleware, CategoryController.createCategory);
CategoryRouter.patch('/:id', userMiddleware, CategoryController.updateCategory);


export default CategoryRouter;
