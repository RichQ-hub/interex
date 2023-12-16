import { Router } from 'express';
import { catchErrors } from '../utils/catchErrors';
import { createComment, getComments } from '../controllers/comments.controller';

// Controllers.

const router = Router();

router.get('/:threadId', catchErrors(getComments));
router.post('/:threadId/new', catchErrors(createComment));

export default router;