import { Router } from 'express';
import { catchErrors } from '../utils/catchErrors';
import {
  createComment,
  deleteComment,
  getComments,
  replyComment,
  updateComment,
  voteComment
} from '../controllers/comments.controller';

const router = Router();

router.get('/:threadId', catchErrors(getComments));
router.post('/:threadId', catchErrors(createComment));
router.put('/:commentId', catchErrors(updateComment));
router.delete('/:commentId', catchErrors(deleteComment));
router.post('/vote/:commentId', catchErrors(voteComment));
router.post('/reply/:threadId/:commentId', catchErrors(replyComment));

export default router;
