import { Router } from 'express';
import userRoutes from '../routes/users';

const router = Router();

router.use('/users', userRoutes);

export default router;