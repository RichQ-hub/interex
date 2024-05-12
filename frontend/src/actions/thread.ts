'use server';

import ThreadService from '@/services/ThreadService';
import { Token } from '@/services/helpers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const createThread = async (token: Token, communityId: string, formData: FormData) => {
  const title = formData.get('title')?.toString() || '';
  const content = formData.get('content')?.toString() || '';
  const flairs = formData.getAll('flairs').map((f) => f.toString());
  
  await ThreadService.createThread(token, communityId, {
    title,
    content,
    flairs,
  });

  const returnPath = `/communities/${communityId}/threads`;
  revalidatePath(returnPath);
  redirect(returnPath);
}