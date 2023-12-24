import { Router } from 'express';
import { catchErrors } from '../utils/catchErrors';
import authorize from '../middleware/authorize';
import {
  login,
  register,
  verifyToken
} from '../controllers/auth.controller';

const router = Router();

router.post('/register', catchErrors(register));
router.post('/login', catchErrors(login));
router.get('/verify', authorize, catchErrors(verifyToken));

export default router;
