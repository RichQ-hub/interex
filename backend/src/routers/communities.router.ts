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
import {
	CreateCategorySchema,
	CreateCommunitySchema,
	CreateFlairSchema,
	EditCommunitySchema
} from '../schemas/communities.schema';
import validation from '../middleware/validation';

const router = Router();

router.get('/', catchErrors(getAllCommunities));
router.get('/categories', catchErrors(getAllCategories));
router.get('/search', catchErrors(searchCommunities));
router.get('/:communityId', catchErrors(getCommunityDetails));
router.post('/create', authorize, validation(CreateCommunitySchema, 'body'), catchErrors(createCommunity));
router.put('/edit/:communityId', authorize, validation(EditCommunitySchema, 'body'), catchErrors(editCommunity))
router.delete('/:communityId', authorize, catchErrors(deleteCommunity));
router.post('/category/create', authorize, validation(CreateCategorySchema, 'body'), catchErrors(createCategory));
router.get('/flair/:communityId', catchErrors(getAllFlairs));
router.post('/flair/create/:communityId', authorize, validation(CreateFlairSchema, 'body'), catchErrors(createFlair));
router.post('/join/:communityId', authorize, catchErrors(joinCommunity));

export default router;
