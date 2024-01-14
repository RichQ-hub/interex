import RegisterForm from '@/components/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | Interex',
  description: 'Search for communities or create your own!',
}

export default function SignupPage() {
  return (
    <div className='flex justify-center items-center'>
      <RegisterForm />
    </div>
  )
}