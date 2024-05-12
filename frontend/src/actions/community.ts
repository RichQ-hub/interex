'use server';

import { Token } from '@/services/helpers';
import CommunityService from '@/services/CommunityService';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const createCommunity = async (token: Token, formData: FormData) => {
  const name = formData.get('name')?.toString() || '';
  const description = formData.get('description')?.toString() || '';
  const categories = formData.getAll('categories').map((c) => c.toString());
  console.log(categories);

  // await CommunityService.createCommunity(token, {
  //   name,
  //   description,
  //   categories,
  // });

  // // After a successful creation, we refetch the communities with the newly created community.
  // const returnPath = '/communities';
  // revalidatePath(returnPath);
  // redirect(returnPath);
}

export const createCategory = async (token: Token, formData: FormData) => {
  const name = formData.get('name')?.toString() || '';

  await CommunityService.createCategory(token, {
    name,
  });

  // After a successful creation, we refetch the communities with the newly created community.
  const returnPath = '/communities';
  revalidatePath(returnPath);
  redirect(returnPath);
}

export const createFlair = async (token: Token, communityId: string, formData: FormData) => {
  const name = formData.get('name')?.toString() || '';
  const hexColor = formData.get('color')?.toString() || '';
  
  await CommunityService.createFlair(token, communityId, {
    name,
    hexColor,
  });

  revalidatePath(`/communities/${communityId}`, 'layout');
  redirect(`/communities/${communityId}/threads`);
}