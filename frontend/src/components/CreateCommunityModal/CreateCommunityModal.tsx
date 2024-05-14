import React from 'react';
import Modal from '../Modal';
import TextInput from '../TextInput';
import TextareaInput from '../TextareaInput';
import { saira } from '@/fonts';
import CategorySelect from '../CategorySelect';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { createCommunity } from '@/actions/community';
import CommunityService from '@/services/CommunityService';

const CreateCommunityModal = async () => {
  // const session = await getServerSession(authOptions);
  const session = await getServerSession(authOptions);
  const createCommunityAction = createCommunity.bind(null, session?.user.accessToken);
  const categories = await CommunityService.getAllCategories();

  return (
    <Modal
      title='Create New Community'
    >
      <form
        action={createCommunityAction}
      >
        <TextInput
          title='Name'
          id='create-community-name'
          name='name'
          type='text'
          icon={null}
          required={true}
          defaultValue=''
        />
        <TextareaInput
          title='Description'
          id='create-community-desc'
          name='description'
          required={true}
          defaultValue=''
        />

        {/* Categories */}
        <div className='mb-4'>
          <h2 className={`${saira.className} font-semibold text-lg mb-2 text-white`}>Select Categories</h2>
          <CategorySelect categories={categories} />
        </div>

        <button
          className='block ml-auto px-2 py-1 bg-interex-blue rounded-sm font-semibold text-sm'
          type='submit'
        >
          Create
        </button>
      </form>
    </Modal>
  )
}

export default CreateCommunityModal;
