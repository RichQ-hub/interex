'use server';

import AuthService from '@/services/AuthService';
import { redirect } from 'next/navigation';

export const register = async (formData: FormData) => {
  const email = formData.get('email')?.toString() || '';
  const username = formData.get('username')?.toString() || '';
  const password = formData.get('password')?.toString() || '';
  const confirmPassword = formData.get('password-confirm')?.toString() || '';

  if (password !== confirmPassword) {
    console.log('Password do not match!');
    return;
  }

  const user = await AuthService.register(email, username, password);

  if (!user) {
    console.log('Did not sign up correctly.');
  }

  // After a successful register, we redirect to the login page.
  redirect('/login');
}