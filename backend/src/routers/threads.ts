import { Router } from 'express';
import { catchErrors } from '../utils/catchErrors';

// Controllers.
import {
  createThread,
  deleteThread,
  downvoteThread,
  getThreads,
  pinThread,
  unpinThread,
  updateThread,
  upvoteThread
} from '../controllers/threads.controller';

const router = Router();

router.get('/:communityId', catchErrors(getThreads));
router.post('/:communityId', catchErrors(createThread));
router.put('/:threadId', catchErrors(updateThread));
router.delete('/:threadId', catchErrors(deleteThread));
router.post('/upvote/:threadId', catchErrors(upvoteThread));
router.post('/downvote/:threadId', catchErrors(downvoteThread));
router.post('/pin/:threadId', catchErrors(pinThread));
router.post('/unpin/:threadId', catchErrors(unpinThread));

export default router;
