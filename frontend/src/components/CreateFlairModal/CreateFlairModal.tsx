'use client';

import React from 'react';
import Modal from '../Modal';
import TextInput from '../TextInput';
import { saira } from '@/fonts';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { createFlair } from '@/actions/community';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

const CreateFlairModal = async ({
  communityId,
}: {
  communityId: string;
}) => {
  const { data: session } = useSession();
  const createFlairAction = createFlair.bind(null, session?.user.accessToken, communityId);
  const searchParams = useSearchParams();

  return (
    <>
      {searchParams.get('createFlairModal') &&
        <Modal title='Create New Flair'>
          <form action={createFlairAction}>
            {/* Flair Name */}
            <TextInput
              title='Name'
              id='create-flair-name'
              name='name'
              type='text'
              icon={null}
              required={true}
              defaultValue=''
            />

            {/* Color Picker */}
            <label
              className={`${saira.className} block font-semibold text-lg mb-2 text-white`}
              htmlFor='flair-color-picker'
            >
              Colour
            </label>
            <input
              className='block'
              type='color'
              name='color'
              id='flair-color-picker'
            />

            {/* Submit */}
            <button
              className='block ml-auto px-2 py-1 bg-interex-blue rounded-sm font-semibold text-sm'
              type='submit'
            >
              Create
            </button>
          </form>
        </Modal>
      }
    </>
  )
}

export default CreateFlairModal;
