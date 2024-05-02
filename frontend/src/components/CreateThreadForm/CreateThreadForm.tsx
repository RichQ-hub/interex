'use client';

import { saira } from '@/fonts';
import useFormInputText from '@/hooks/useFormInputText';
import React from 'react';
import TextInput from '../TextInput';
import TextareaInput from '../TextareaInput';
import { FlairDetails } from '@/types/communities';

const CreateThreadForm = ({
  communityFlairs,
}: {
  communityFlairs: FlairDetails[];
}) => {
  const title = useFormInputText();
  const content = useFormInputText();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

      
    </form>
  )
}

export default CreateThreadForm;
