import { saira } from '@/fonts';
import clsx from 'clsx';
import React from 'react';

const TextInput = ({
  title,
  id,
  name,
  type,
  icon,
  required,
  defaultValue,
}: {
  title: string;
  id: string;
  name: string;
  type: 'text' | 'password' | 'email';
  icon: React.ReactNode;
  required: boolean;
  defaultValue: string;
}) => {
  return (
    <div className='mb-4'>
      <label
        htmlFor={id}
        className={`${saira.className} font-semibold text-lg mb-2 text-white`}
      >
        {title}
      </label>

      {/* Input Wrapper */}
      <div className='relative'>
        {icon && <div className='absolute fill-white left-0 top-0 bottom-0 flex items-center px-3'>{icon}</div>}
        <input
          className={clsx(
            `bg-interex-input h-9 w-full px-3 text-white`,
            {
              'pl-9': icon
            }
          )}
          id={id}
          name={name}
          type={type}
          required={required}
          defaultValue={defaultValue}
        />
      </div>
    </div>
  )
}

export default TextInput;
