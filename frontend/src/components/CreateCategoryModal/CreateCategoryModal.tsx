'use client';

import useFormInputText from '@/hooks/useFormInputText';
import CommunityService from '@/services/CommunityService';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useState } from 'react';
import Modal from '../Modal';
import TextInput from '../TextInput';

const CreateCategoryModal = () => {
  const { data: session } = useSession();

  const name = useFormInputText();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await CommunityService.createCategory(session?.user.accessToken, {
      name: name.value,
    })

    // Refetches the data for communities.
    router.refresh();

    // Closes the modal (for some reason router.push('communities') does not work).
    router.back();
  }

  return (
    <Modal title='Create New Category'>
      <form onSubmit={handleSubmit}>
        <TextInput
          title='Name'
          inputType='text'
          icon={null}
          required={true}
          value={name.value}
          handleInputChange={name.handleChange}
        />

        <button
          className='block ml-auto px-2 py-1 bg-interex-blue rounded-sm font-semibold text-sm'
          disabled={loading ? true : false}
        >
          {loading ? (
            <p>Submitting...</p>
          ) : (
            <p>Create</p>
          )}
        </button>
      </form>
    </Modal>
  )
}

export default CreateCategoryModal;
