import { Router } from 'express';
import { catchErrors } from '../utils/catchErrors';
import authorize from '../middleware/authorize';
import {
  deleteUser,
  getAllUsers,
  login,
  register,
  testConnection,
  verifyToken
} from '../controllers/auth.controller';

const router = Router();

router.get('/test', catchErrors(testConnection));
router.post('/register', catchErrors(register));
router.post('/login', catchErrors(login));
router.get('/verify', authorize, catchErrors(verifyToken));
router.get('/users', catchErrors(getAllUsers));
router.delete('/user', authorize, catchErrors(deleteUser));

export default router;
