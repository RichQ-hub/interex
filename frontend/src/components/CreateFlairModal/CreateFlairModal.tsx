'use client';

import useFormInputText from '@/hooks/useFormInputText';
import { useSession } from 'next-auth/react';
import React, { FormEvent, useState } from 'react';
import Modal from '../Modal';
import TextInput from '../TextInput';
import { saira } from '@/fonts';
import CommunityService from '@/services/CommunityService';
import { useRouter } from 'next/navigation';

const CreateFlairModal = ({
  communityId,
}: {
  communityId: string;
}) => {
  const { data: session } = useSession();
  const router = useRouter();

  const name = useFormInputText();
  const hexColor = useFormInputText('#000000');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await CommunityService.createFlair(session?.user.accessToken, communityId, {
      name: name.value,
      hexColor: hexColor.value,
    })

    // Refetches the data for communities.
    router.refresh();

    // Closes the modal (for some reason router.push('communities') does not work).
    router.back();
  }

  return (
    <Modal title='Create New Flair'>
      <form onSubmit={handleSubmit}>
        {/* Flair Name */}
        <TextInput
          title='Name'
          inputType='text'
          icon={null}
          required={true}
          value={name.value}
          handleInputChange={name.handleChange}
        />

        {/* Color Picker */}
        <label
          className={`${saira.className} block font-semibold text-lg mb-2 text-white`}
          htmlFor='flair-color-picker'
        >
          Colour
        </label>
        <input
          className='block colo'
          type='color'
          value={hexColor.value}
          id='flair-color-picker'
          onChange={hexColor.handleChange}
        />

        {/* Submit */}
        <button
          className='block ml-auto px-2 py-1 bg-interex-blue rounded-sm font-semibold text-sm'
          disabled={loading ? true : false}
          type='submit'
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

export default CreateFlairModal;
