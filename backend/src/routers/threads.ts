import { Router } from 'express';
import { catchErrors } from '../utils/catchErrors';
import authorize from '../middleware/authorize';

// Controllers.
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

const router = Router();

router.get('/:communityId', catchErrors(getAllThreads));
router.get('/details/:threadId', catchErrors(getThreadDetails));
router.post('/:communityId', authorize, catchErrors(createThread));
router.put('/:threadId', authorize, catchErrors(updateThread));
router.delete('/:threadId', authorize, catchErrors(deleteThread));
router.post('/vote/:threadId', authorize, catchErrors(voteThread));
router.post('/pin/:communityId/:threadId', authorize, catchErrors(pinThread));
router.post('/unpin/:communityId/:threadId', authorize, catchErrors(unpinThread));
router.post('/flair/:communityId/:threadId/:flairId', authorize, catchErrors(addFlair));

export default router;
