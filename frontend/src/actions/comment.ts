'use server';

import { Token } from '@/services/helpers';
import CommentService from '@/services/CommentService';
import { revalidatePath } from 'next/cache';

export const createComment = async (token: Token, communityId: string, threadId: string, formData: FormData) => {
  const content = formData.get('content')?.toString() || '';

  await CommentService.createComment(token, threadId, content);

  // After a successful creation, we refetch the communities with the newly created community.
  revalidatePath(`/communities/${communityId}/threads/${threadId}`);
}