import { Router } from 'express';
import { catchErrors } from '../utils/catchErrors';
import authorize from '../middleware/authorize';

import {
  createThread,
  deleteThread,
  voteThread,
  getAllThreads,
  pinThread,
  unpinThread,
  updateThread,
  addFlair,
  getThreadDetails,
} from '../controllers/threads.controller';
import {
	CreateThreadSchema,
	EditThreadSchema,
	VoteThreadSchema
} from '../schemas/threads.schema';
import validation from '../middleware/validation';

const router = Router();

router.get('/:communityId', catchErrors(getAllThreads));
router.get('/details/:threadId', catchErrors(getThreadDetails));
router.post('/:communityId', authorize, validation(CreateThreadSchema, 'body'), catchErrors(createThread));
router.put('/:threadId', authorize, validation(EditThreadSchema, 'body'), catchErrors(updateThread));
router.delete('/:threadId', authorize, catchErrors(deleteThread));
router.post('/vote/:threadId', authorize, validation(VoteThreadSchema, 'body'), catchErrors(voteThread));
router.post('/pin/:communityId/:threadId', authorize, catchErrors(pinThread));
router.post('/unpin/:communityId/:threadId', authorize, catchErrors(unpinThread));
router.post('/flair/:communityId/:threadId/:flairId', authorize, catchErrors(addFlair));

export default router;
