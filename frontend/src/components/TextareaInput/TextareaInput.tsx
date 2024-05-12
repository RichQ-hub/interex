import { saira } from '@/fonts';
import React from 'react';

const TextareaInput = ({
  title,
  id,
  name,
  required,
  defaultValue,
}: {
  title: string;
  id: string;
  name: string;
  required: boolean;
  defaultValue: string;
}) => {

  return (
    <div className='mb-4'>
      <label htmlFor={id} className={`${saira.className} font-semibold text-lg mb-2 text-white`}>{title}</label>
      <textarea
        className='bg-interex-input px-3 py-1 w-full resize-y min-h-[100px] max-h-[300px] text-white'
        id={id}
        name={name}
        required={required}
        defaultValue={defaultValue}
      />
    </div>
  )
}

export default TextareaInput;
