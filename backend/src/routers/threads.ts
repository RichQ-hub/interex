import { Router } from 'express';
import { catchErrors } from '../utils/catchErrors';

// Controllers.

const router = Router();

router.get('/:communityId');
router.post('/new');
router.get('/category');

export default router;
