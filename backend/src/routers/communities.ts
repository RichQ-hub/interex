import { Router } from 'express';
import { catchErrors } from '../utils/catchErrors';

// Controllers.
import {
  createCommunity,
  filterCommunitiesByCategory,
  getAllCommunities
} from '../controllers/communities.controller';

const router = Router();

router.get('/', catchErrors(getAllCommunities));
router.post('/new', catchErrors(createCommunity));
router.get('/category', catchErrors(filterCommunitiesByCategory));

export default router;
