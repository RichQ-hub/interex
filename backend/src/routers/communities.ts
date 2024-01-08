import { Router } from 'express';
import { catchErrors } from '../utils/catchErrors';
import authorize from '../middleware/authorize';
import {
  createCommunity,
  deleteCommunity,
  searchCommunities,
  getAllCommunities,
  getCommunityDetails,
  createCategory,
  addCategory,
  createFlair,
  getAllFlairs,
  getAllCategories,
  joinCommunity
} from '../controllers/communities.controller';

const router = Router();

router.get('/', catchErrors(getAllCommunities));
router.get('/categories', catchErrors(getAllCategories));
router.get('/search', catchErrors(searchCommunities));
router.get('/:communityId', catchErrors(getCommunityDetails));
router.post('/new', authorize, catchErrors(createCommunity));
router.delete('/:communityId', authorize, catchErrors(deleteCommunity));
router.post('/category/new', catchErrors(createCategory));
router.post('/category/add/:communityId/:categoryId', authorize, catchErrors(addCategory));
router.get('/flair/:communityId', catchErrors(getAllFlairs));
router.post('/flair/new/:communityId', authorize, catchErrors(createFlair));
router.post('/join/:communityId', authorize, catchErrors(joinCommunity));

export default router;
