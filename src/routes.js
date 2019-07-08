import { Router } from 'express';
import multer from 'multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authHeader from './app/middlewares/auth';
import FileController from './app/controllers/FileController';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authHeader);
routes.put('/users', UserController.update);
routes.post('/files', upload.single('file'), FileController.store);
// routes.get('/files', FileController.index);

export default routes;
