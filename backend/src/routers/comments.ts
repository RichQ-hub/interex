import { Router } from 'express';
import { catchErrors } from '../utils/catchErrors';
import { getCommentsV2 } from '../controllers/comments.controller';

// Controllers.

const router = Router();

router.get('/:threadId', catchErrors(getCommentsV2));

export default router;