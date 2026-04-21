import { Router } from 'express';
import { createBoard, getUserBoards, getBoardDetail } from '../controllers/board.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Semua route board harus melewati pengecekan login (authenticate)
router.use(authenticate);

router.post('/', createBoard);         // POST /api/boards
router.get('/', getUserBoards);        // GET /api/boards
router.get('/:id', getBoardDetail);    // GET /api/boards/:id

export default router;