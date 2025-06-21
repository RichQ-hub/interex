import React from 'react';
import Modal from '../Modal';
import TextInput from '../TextInput';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { createCategory } from '@/actions/community';

const CreateCategoryModal = async () => {
  const session = await getServerSession(authOptions);
  const createCategoryAction = createCategory.bind(null, session?.user.accessToken);

  return (
    <Modal title='Create New Category'>
      <form action={createCategoryAction}>
        <TextInput
          title='Name'
          id='create-category-name'
          name='name'
          type='text'
          icon={null}
          required={true}
          defaultValue=''
        />

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

export default CreateCategoryModal;
