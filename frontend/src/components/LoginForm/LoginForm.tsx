'use client'

import useFormInputText from '@/hooks/useFormInputText';
import React from 'react';
import TextInput from '../TextInput';
import { saira } from '@/fonts';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

const LoginForm = () => {
  const email = useFormInputText();
  const password = useFormInputText();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await signIn('credentials', {
      email: email.value,
      password: password.value,
      callbackUrl: '/'
    });
  }

  return (
    <form
      action=''
      className='w-96 bg-[#0F172A99] mt-14 p-6 shadow-[0px_6px_4px_2px_rgba(0,0,0,0.60)]'
      onSubmit={handleSubmit}
    >
      <h1 className={`${saira.className} text-interex-blue font-bold text-2xl mb-4`}>Login</h1>
      <TextInput
        title='Email'
        inputType='email'
        icon={<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>}
        required={true}
        value={email.value}
        handleInputChange={email.handleChange}
      />
      <TextInput
        title='Password'
        inputType='password'
        icon={<svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/></svg>}
        required={true}
        value={password.value}
        handleInputChange={password.handleChange}
      />

      <button
        className={`${saira.className} fill-black flex items-center justify-center gap-4 mt-8 w-full bg-interex-blue text-black font-semibold text-xl py-2 rounded-[4px]`}
        type='submit'
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"/></svg>
        Login
      </button>

      <p className={`${saira.className} font-semibold text-lg text-center mt-2`}>
        Don't have an account? &nbsp;
        <Link href='/register' className='text-interex-aqua hover:underline'>Sign Up</Link>
      </p>
    </form>
  )
}

export default LoginForm;
