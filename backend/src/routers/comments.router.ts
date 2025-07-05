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
import {
	CreateCommentSchema,
	EditCommentSchema,
	ReplyCommentSchema,
	VoteCommentSchema
} from '../schemas/comments.schema';
import validation from '../middleware/validation';

const router = Router();

router.get('/:threadId', catchErrors(getComments));
router.post('/:threadId', authorize, validation(CreateCommentSchema, 'body'), catchErrors(createComment));
router.put('/:commentId', authorize, validation(EditCommentSchema, 'body'), catchErrors(updateComment));
router.delete('/:commentId', authorize, catchErrors(deleteComment));
router.post('/vote/:commentId', authorize, validation(VoteCommentSchema, 'body'), catchErrors(voteComment));
router.post('/reply/:threadId/:commentId', authorize, validation(ReplyCommentSchema, 'body'), catchErrors(replyComment));

export default router;
