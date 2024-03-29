'use client';

import React, { FormEvent, useState } from 'react';
import Modal from '../Modal';
import TextInput from '../TextInput';
import useFormInputText from '@/hooks/useFormInputText';
import TextareaInput from '../TextareaInput';
import CommunityService from '@/services/CommunityService';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { saira } from '@/fonts';
import CategorySelect from '../CategorySelect';
import { Category } from '@/types/communities';
import { revalidatePath } from 'next/cache';

const CreateCommunityModal = ({
  categories
}: {
  categories: Category[];
}) => {
  const name = useFormInputText();
  const description = useFormInputText();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const router = useRouter();

  // We simply extract the data property using object destructuring and then assign it a
  // different name 'session'.
  const { data: session } = useSession();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await CommunityService.createCommunity(session?.user.accessToken, {
      name: name.value,
      description: description.value,
      categories: selectedCategories,
    })

    // Refetches the data for communities.
    router.refresh();

    // Closes the modal (for some reason router.push('communities') does not work).
    router.back();
  }

  const handleToggleCategory = (categoryId: string, checked: boolean) => {
    const newCategories = selectedCategories.slice();
    if (checked) {
      newCategories.push(categoryId);
      setSelectedCategories(newCategories);
    } else {
      setSelectedCategories(newCategories.filter((currCategory) => {
        return currCategory !== categoryId;
      }))
    }
  }

  return (
    <Modal
      title='Create New Community'
    >
      <form onSubmit={handleSubmit}>
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

        {/* Categories */}
        <div className='mb-4'>
          <h2 className={`${saira.className} font-semibold text-lg mb-2 text-white`}>Select Categories</h2>
          <CategorySelect categories={categories} handleToggleCategory={handleToggleCategory} selectedCategories={selectedCategories} />
        </div>

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

export default CreateCommunityModal;
