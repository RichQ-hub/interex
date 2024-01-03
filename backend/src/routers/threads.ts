import { Router } from 'express';
import { catchErrors } from '../utils/catchErrors';

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
} from '../controllers/threads.controller';

const router = Router();

router.get('/:communityId', catchErrors(getAllThreads));
router.post('/:communityId', catchErrors(createThread));
router.put('/:threadId', catchErrors(updateThread));
router.delete('/:threadId', catchErrors(deleteThread));
router.post('/vote/:threadId', catchErrors(voteThread));
router.post('/pin/:communityId/:threadId', catchErrors(pinThread));
router.post('/unpin/:communityId/:threadId', catchErrors(unpinThread));
router.post('/flair/:communityId/:threadId/:flairId', catchErrors(addFlair));

export default router;
