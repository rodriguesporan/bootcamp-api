import { Router } from 'express';
import multer from 'multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authHeader from './app/middlewares/auth';
import FileController from './app/controllers/FileController';
import multerConfig from './config/multer';
import MeetupController from './app/controllers/MeetupController';
import SubscriptionController from './app/controllers/SubscriptionController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authHeader);
routes.put('/users', UserController.update);
routes.post('/files', upload.single('file'), FileController.store);

routes.post('/meetups', MeetupController.store);
routes.put('/meetups/:id', MeetupController.update);
routes.get('/meetups', MeetupController.index);
routes.delete('/meetups/:id', MeetupController.delete);

routes.post('/subscriptions', SubscriptionController.store);

export default routes;
