'use client';

import useFormInputText from '@/hooks/useFormInputText';
import React, { useState } from 'react';
import TextInput from '../TextInput';
import TextareaInput from '../TextareaInput';
import { FlairDetails } from '@/types/communities';
import ThreadService from '@/services/ThreadService';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import FlairSelect from '../FlairSelect';

const CreateThreadForm = ({
  communityId,
  communityFlairs,
}: {
  communityId: string;
  communityFlairs: FlairDetails[];
}) => {
  // We simply extract the data property using object destructuring and then assign it a
  // different name 'session'.
  const { data: session } = useSession();
  const router = useRouter();

  const title = useFormInputText();
  const content = useFormInputText();
  const [selectedFlairIds, setSelectedFlairIds] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await ThreadService.createThread(session?.user.accessToken, communityId, {
      title: title.value,
      content: content.value,
      flairs: selectedFlairIds,
    })

    router.back();
  }

  const handleToggleFlair = (flairId: string, checked: boolean) => {
    const newFlairs = selectedFlairIds.slice();
    if (checked) {
      newFlairs.push(flairId);
      setSelectedFlairIds(newFlairs);
    } else {
      setSelectedFlairIds(newFlairs.filter((f) => {
        return f !== flairId;
      }));
    }
  }

  return (
    <form
      action=''
      onSubmit={handleSubmit}
    >
      <TextInput
        title='Title'
        inputType='text'
        icon={null}
        required={true}
        value={title.value}
        handleInputChange={title.handleChange}
      />

      <TextareaInput 
        title='Content'
        required={true}
        value={content.value}
        handleInputChange={content.handleChange}
      />

      {/* Flair Select */}
      <FlairSelect
        flairs={communityFlairs}
        selectedFlairIds={selectedFlairIds}
        handleToggleFlair={handleToggleFlair}
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
