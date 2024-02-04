import { saira } from '@/fonts';
import React from 'react'

const TextareaInput = ({
  title,
  required,
  value,
  handleInputChange,
}: {
  title: string;
  required: boolean;
  value: string;
  handleInputChange: (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) => {
  return (
    <div className='mb-4'>
      <h2 className={`${saira.className} font-semibold text-lg mb-2 text-white`}>{title}</h2>
      <textarea
        className='bg-interex-input px-3 py-1 w-full resize-y min-h-[100px] max-h-[300px] text-white'
        required={required}
        value={value}
        onChange={handleInputChange}
      />
    </div>
  )
}

export default TextareaInput;
