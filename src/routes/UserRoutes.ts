import { Router } from 'express';
import UserController from '../controllers/user.controller';

const UserRouter: Router = Router();


UserRouter.get('/', UserController.getAll);
UserRouter.post('/login', UserController.login);
UserRouter.post('/registration', UserController.registration);

export default UserRouter;
