import { Router } from 'express';
import { catchErrors } from '../utils/catchErrors';
import { getComments } from '../controllers/comments.controller';

// Controllers.

const router = Router();

router.get('/:threadId', catchErrors(getComments));

export default router;