import { Router } from 'express';
import { catchErrors } from '../utils/catchErrors';

// Controllers.
import {
  createCommunity,
  deleteCommunity,
  searchCommunities,
  getAllCommunities,
  getCommunityDetails,
  createCategory,
  addCategory,
  createFlair
} from '../controllers/communities.controller';

const router = Router();

router.get('/', catchErrors(getAllCommunities));
router.get('/search', catchErrors(searchCommunities));
router.get('/:communityId', catchErrors(getCommunityDetails));
router.post('/new', catchErrors(createCommunity));
router.delete('/:communityId', catchErrors(deleteCommunity));
router.post('/category/new', catchErrors(createCategory));
router.post('/category/add/:communityId/:categoryId', catchErrors(addCategory));
router.post('/flair/new/:communityId', catchErrors(createFlair));

export default router;
