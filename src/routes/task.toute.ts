import { Router } from 'express';
import { createTask, getTaskDetail, updateTask, deleteTask } from '../controllers/task.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', createTask);
router.get('/:id', getTaskDetail);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;