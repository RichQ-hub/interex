'use client';

import React from 'react';
import Modal from '../Modal';
import TextInput from '../TextInput';
import useFormInputText from '@/hooks/useFormInputText';
import TextareaInput from '../TextareaInput';

const CreateCommunityModal = () => {
  const name = useFormInputText();
  const description = useFormInputText();

  return (
    <Modal
      title='Create New Community'
    >
      <form action=''>
        <TextInput
          title='Name'
          inputType='text'
          icon={null}
          required={true}
          value={name.value}
          handleInputChange={name.handleChange}
        />
        <TextareaInput
          title='Description'
          required={true}
          value={description.value}
          handleInputChange={description.handleChange}
        />
      </form>
    </Modal>
  )
}

export default CreateCommunityModal;
