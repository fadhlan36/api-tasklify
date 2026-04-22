import { Router } from 'express';
import {
    createBoard,
    getUserBoards,
    getBoardDetail,
    updateBoard, 
    deleteBoard 
} from '../controllers/board.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Semua route board harus melewati pengecekan login (authenticate)
router.use(authenticate);

router.post('/', createBoard);
router.get('/', getUserBoards);
router.get('/:id', getBoardDetail);
router.put('/:id', updateBoard);   
router.delete('/:id', deleteBoard); 

export default router;