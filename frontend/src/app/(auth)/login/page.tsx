import LoginForm from '@/components/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | Interex',
  description: 'Search for communities or create your own!',
}

export default function LoginPage() {
  return (
    <div className='flex justify-center items-center'>
      <LoginForm />
    </div>
  )
}