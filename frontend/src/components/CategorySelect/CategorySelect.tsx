import { saira } from '@/fonts';
import React, { useState } from 'react';

const dummyCategories = [
  {
    id: 1,
    name: 'Gaming'
  },
  {
    id: 2,
    name: 'Cooking'
  },
  {
    id: 3,
    name: 'IRL'
  },
  {
    id: 4,
    name: 'Housing'
  },
]

const CategorySelect = ({
  selectedCategories,
  handleToggleCategory,
}: {
  selectedCategories: number[];
  handleToggleCategory: (categoryId: number, checked: boolean) => void;
}) => {
  const [hovered, setHovered] = useState<boolean>(false);

  return (
    <button
      className='relative inline text-white'
      type='button'
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      Options {'>>'}&nbsp;
      {
        hovered &&
        <dialog open className='absolute top-0 bottom-0 left-full p-4 bg-[#0f1a2c] border-[#5a7f9c] border-[1px] text-white'>
          <h2 className={`${saira.className} font-semibold text-lg mb-1`}>Categories</h2>
          <ul>
            {dummyCategories.map((category) => {
              return (
                <li key={category.id}>
                  <label
                    className='flex items-center cursor-pointer hover:bg-interex-input w-full px-2'
                    htmlFor={`category-select-${category.id}`}
                  >
                    <input
                      className='mr-2'
                      type='checkbox'
                      id={`category-select-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onChange={(e) => handleToggleCategory(category.id, e.currentTarget.checked)}
                    />  
                    {category.name}
                  </label>
                </li>
              )
            })}
          </ul>
        </dialog>
      }
    </button>
  )
}

export default CategorySelect;
