import { Router } from 'express';
import userController from '../controllers/user';
import multer from 'multer';
import multerConfig from '../config/multer';

const router = Router();

router.post('/', 
            multer(multerConfig).array('file[]', 6), 
            userController.create
);

export default router;