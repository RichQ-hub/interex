import { saira } from '@/fonts';
import { Category } from '@/types/communities';
import React, { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

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
  categories,
  selectedCategories,
  handleToggleCategory,
}: {
  categories: Category[];
  selectedCategories: string[];
  handleToggleCategory: (categoryId: string, checked: boolean) => void;
}) => {
  const [hovered, setHovered] = useState<boolean>(false);

  const handleDelayLeave = useDebouncedCallback(() => {
    setHovered(false);
  }, 200);

  return (
    <button
      className={`${saira.className} relative font-semibold bg-interex-blue-light py-1 px-2 box-content`}
      type='button'
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleDelayLeave}
    >
      Options {'>'}&nbsp;
      {
        hovered &&
        <dialog
          open
          className='absolute w-max top-0 bottom-0 left-full p-4 bg-[#0f1a2c] border-[#5a7f9c] border-[1px] text-white'
        >
          {/* Tooltip Triange */}
          <div className='absolute top-0 bottom-0 right-full flex items-center'>
            <span className='h-0 w-0 border-t-transparent border-t-[10px] border-b-transparent border-b-[10px] border-r-[10px] border-r-[#5a7f9c]'></span>
          </div>

          {/* Tooltip Content */}
          <div>
            <h2 className={`${saira.className} font-semibold text-lg mb-1`}>Categories</h2>
            <ul>
              {categories.map((category) => {
                return (
                  <li key={category.id}>
                    <label
                      className='flex items-center cursor-pointer hover:bg-interex-input px-2'
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
          </div>
        </dialog>
      }
    </button>
  )
}

export default CategorySelect;

/**
 * CSS Triange Trick (for tooltip):
 * https://css-tricks.com/snippets/css/css-triangle/
 */
