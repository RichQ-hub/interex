import { Router } from 'express';
import { catchErrors } from '../utils/catchErrors';

// Controllers.
import {
  createCommunity,
  deleteCommunity,
  filterCommunitiesByCategory,
  getAllCommunities,
  getCommunityDetails
} from '../controllers/communities.controller';

const router = Router();

router.get('/', catchErrors(getAllCommunities));
router.get('/category', catchErrors(filterCommunitiesByCategory));
router.get('/:communityId', catchErrors(getCommunityDetails));
router.post('/new', catchErrors(createCommunity));
router.delete('/:communityId', catchErrors(deleteCommunity));

export default router;
