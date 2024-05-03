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

// FOR TESTING ========================================

const colors = {
  purple: '#9939D4',
  green: '#39D46E',
  red: '#D43939',
  yellow: '#DFE224'
}

const flairs = [
  {
    id: '1',
    name: 'Help',
    hexColor: colors.purple
  },
  {
    id: '2',
    name: 'News',
    hexColor: colors.red
  },
  {
    id: '3',
    name: 'Skin',
    hexColor: colors.yellow
  },
  {
    id: '4',
    name: 'Support Main',
    hexColor: colors.green
  },
]

// ====================================================

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
        flairs={flairs}
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