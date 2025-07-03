import { Router } from 'express';
import { catchErrors } from '../utils/catchErrors';
import authorize from '../middleware/authorize';
import {
  deleteUser,
  getAllUsers,
  login,
  register,
  verifyToken
} from '../controllers/auth.controller';
import validation from '../middleware/validation';
import { LoginUserSchema, RegisterUserSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/register', validation(RegisterUserSchema, 'body'), catchErrors(register));
router.post('/login', validation(LoginUserSchema, 'body'), catchErrors(login));
router.get('/verify', authorize, catchErrors(verifyToken));
router.get('/users', catchErrors(getAllUsers));
router.delete('/user', authorize, catchErrors(deleteUser));

export default router;
