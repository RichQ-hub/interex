import React from 'react';
import { FlairDetails } from '@/types/communities';
import TextInput from '../TextInput';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { createThread } from '@/actions/thread';
import TextareaInput from '../TextareaInput';
import FlairSelect from '../FlairSelect';

const CreateThreadForm = async ({
  communityId,
  communityFlairs,
}: {
  communityId: string;
  communityFlairs: FlairDetails[];
}) => {
  const session = await getServerSession(authOptions);
  
  const createThreadAction = createThread.bind(null, session?.user.accessToken, communityId);

  return (
    <form
      action={createThreadAction}
    >
      <TextInput
        title='Title'
        id='create-thread-title'
        name='title'
        type='text'
        icon={null}
        required={true}
        defaultValue=''
      />

      <TextareaInput
        title='Content'
        id='create-thread-content'
        name='content'
        required={true}
        defaultValue=''
      />

      {/* Flair Select */}
      <FlairSelect
        flairs={communityFlairs}
      />

      <button
        className='block ml-auto py-1 px-5 bg-interex-blue text-black font-semibold rounded-md '
        type='submit'
      >
        Post
      </button>
    </form>
  )
}

export default CreateThreadForm;
