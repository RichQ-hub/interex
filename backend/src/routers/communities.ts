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
  createFlair,
  getAllFlairs,
  getAllCategories,
  joinCommunity,
  editCommunity
} from '../controllers/communities.controller';

const router = Router();

router.get('/', catchErrors(getAllCommunities));
router.get('/categories', catchErrors(getAllCategories));
router.get('/search', catchErrors(searchCommunities));
router.get('/:communityId', catchErrors(getCommunityDetails));
router.post('/new', authorize, catchErrors(createCommunity));
router.put('/edit/:communityId', authorize, catchErrors(editCommunity))
router.delete('/:communityId', authorize, catchErrors(deleteCommunity));
router.post('/category/new', authorize, catchErrors(createCategory));
router.get('/flair/:communityId', catchErrors(getAllFlairs));
router.post('/flair/new/:communityId', authorize, catchErrors(createFlair));
router.post('/join/:communityId', authorize, catchErrors(joinCommunity));

export default router;
