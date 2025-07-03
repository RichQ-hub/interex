import { Router } from 'express';
import { catchErrors } from '../utils/catchErrors';
import authorize from '../middleware/authorize';
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
router.post('/:threadId', authorize, catchErrors(createComment));
router.put('/:commentId', authorize, catchErrors(updateComment));
router.delete('/:commentId', authorize, catchErrors(deleteComment));
router.post('/vote/:commentId', authorize, catchErrors(voteComment));
router.post('/reply/:threadId/:commentId', authorize, catchErrors(replyComment));

export default router;
