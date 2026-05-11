import { Router } from 'express';
import { createTask, getTaskDetail, updateTask, deleteTask, moveTask } from '../controllers/task.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/move', moveTask);

router.post('/', createTask);
router.get('/:id', getTaskDetail);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;