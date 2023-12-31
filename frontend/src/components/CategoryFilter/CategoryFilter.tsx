'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const CATEGORIES = ['Gaming', 'Housing', 'News', 'Politics', 'Food', 'Education', 'IRL', 'Sports'];

const CategoryFilter = () => {
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
    <ul>
      {CATEGORIES.map((category, idx) => {
        return (
          <li key={idx}>
            <label
              className='px-2 block cursor-pointer hover:bg-black text-lg'
              htmlFor={`checkbox-${category.toLowerCase()}`}
            >
              <input
                className='mr-4 bg-gray-500'
                type='checkbox'
                name=''
                checked={searchParams.getAll('category').includes(category)}
                id={`checkbox-${category.toLowerCase()}`}
                onChange={(e) => handleToggleCategory(category, e.target.checked)}
              />
              {category}
            </label>
          </li>
        )
      })}
    </ul>
  )
}

export default CategoryFilter;
