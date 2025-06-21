'use client';

import { Category } from '@/types/communities';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const CategoryFilterList = ({
  categories,
}: {
  categories: Category[];
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleToggleCategory = (category: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams);
    
    params.set('page', '1');

    if (checked) {
      params.append('category', category);
    } else {
      const categories = params.getAll('category').filter((cat) => cat !== category);
      params.delete('category');
      categories.forEach((cat) => {
        params.append('category', cat);
      });
    }
    
    // We use scroll = false, so that the scroll position doesn't reset to the top when we 
    // update the search params.
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <ul className='max-h-[200px] overflow-y-auto scrollbar'>
      {categories.map((category, idx) => {
        return (
          <li key={idx}>
            <label
              className='px-2 block cursor-pointer text-lg hover:bg-interex-input'
              htmlFor={`checkbox-${category.name.toLowerCase()}`}
            >
              <input
                className='mr-4 accent-interex-blue'
                type='checkbox'
                name=''
                checked={searchParams.getAll('category').includes(category.name)}
                id={`checkbox-${category.name.toLowerCase()}`}
                onChange={(e) => handleToggleCategory(category.name, e.target.checked)}
              />
              {category.name}
            </label>
          </li>
        )
      })}
    </ul>
  )
}

export default CategoryFilterList;
