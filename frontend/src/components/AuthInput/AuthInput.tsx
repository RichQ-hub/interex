import { saira } from '@/fonts';
import React from 'react';

const AuthInput = ({
  title,
  inputType,
  icon,
  required,
  value,
  handleInputChange,
}: {
  title: string;
  inputType: 'text' | 'password' | 'email';
  icon: React.ReactNode;
  required: boolean;
  value: string;
  handleInputChange: (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) => {
  return (
    <div className='mb-4'>
      <h2 className={`${saira.className} font-semibold text-lg mb-2`}>{title}</h2>

      {/* Input Wrapper */}
      <div className='relative'>
        <div className='absolute fill-white left-0 top-0 bottom-0 flex items-center px-3'>{icon}</div>
        <input className='bg-[#A6BFE326] h-9 w-full pl-9' type={inputType} required={required} value={value} onChange={handleInputChange} />
      </div>
    </div>
  )
}

export default AuthInput;
