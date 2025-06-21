import CommunityService from '@/services/CommunityService';
import CategoryFilterList from './CategoryFilterList';

const CategoryFilter = async () => {
  const categories = await CommunityService.getAllCategories();

  // Simulates a loading state.
  await new Promise((resolve) => setTimeout(resolve, 2000)); 

  return (
    <CategoryFilterList categories={categories} />
  )
}

export default CategoryFilter