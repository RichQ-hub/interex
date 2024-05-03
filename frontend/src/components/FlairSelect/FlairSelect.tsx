import { fira, saira } from '@/fonts';
import { FlairDetails } from '@/types/communities';
import React, { useState } from 'react';

const FlairSelect = ({
  flairs,
  selectedFlairIds,
  handleToggleFlair
}: {
  flairs: FlairDetails[];
  selectedFlairIds: string[];
  handleToggleFlair: (flairId: string, checked: boolean) => void;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <button
      className={`${saira.className} relative py-1 px-6 flex items-center gap-3 rounded-full outline outline-1 outline-white font-semibold hover:bg-slate-600`}
      type='button'
      onClick={() => setIsOpen(!isOpen)}
    >
      <svg className='fill-white w-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 80V229.5c0 17 6.7 33.3 18.7 45.3l176 176c25 25 65.5 25 90.5 0L418.7 317.3c25-25 25-65.5 0-90.5l-176-176c-12-12-28.3-18.7-45.3-18.7H48C21.5 32 0 53.5 0 80zm112 32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      Flairs

      <dialog
        className='absolute w-max left-[110%] p-4 bg-[#0f1a2c] border-[#5a7f9c] border-[1px] text-white cursor-default'
        open={isOpen}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tooltip Triange */}
        <div className='absolute top-0 bottom-0 right-full flex items-center'>
          <span className='h-0 w-0 border-t-transparent border-t-[10px] border-b-transparent border-b-[10px] border-r-[10px] border-r-[#5a7f9c]'></span>
        </div>
      
        <h3 className='mb-2 text-lg'>Select Flairs <span className='italic text-base'>(Optional)</span></h3>
        <ul>
          {flairs.map((flair) => {
            return (
              <li
                key={flair.id}
              >
                <label
                  className='flex items-center cursor-pointer hover:bg-interex-input px-2 py-1'
                  htmlFor={`flair-select-${flair.id}`}
                >
                  <input
                    className='mr-2'
                    type='checkbox'
                    id={`flair-select-${flair.id}`}
                    checked={selectedFlairIds.includes(flair.id)}
                    onChange={(e) => handleToggleFlair(flair.id, e.currentTarget.checked)}
                  />
                  <div
                    className='text-sm text-black rounded-xl px-3'
                    style={{ backgroundColor: `${flair.hexColor}` }}
                  >
                    {flair.name}
                  </div>
                </label>
              </li>
            )
          })}
        </ul>
      </dialog>
  

    </button>
  )
}

export default FlairSelect;
