'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { FormEvent, useState } from 'react';
import avatar from '../../assets/avatar.jpg';
import { saira } from '@/fonts';
import { useRouter } from 'next/navigation';
import useFormInputText from '@/hooks/useFormInputText';
import CommentService from '@/services/CommentService';

const PostComment = ({
  threadId,
}: {
  threadId: string;
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const comment = useFormInputText();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

		console.log(comment.value);

    await CommentService.createComment(session?.user.accessToken, threadId, comment.value);

    // Refetches the data for communities.
    router.refresh();

    // Clear comment box.
    comment.setValue('');
  
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className='mb-4 p-4 bg-interex-comment-bg'>
      {/* Header */}
      <div className='mb-3 flex items-center gap-2'>
        <Image
          className='rounded-full w-8 border-white border-2'
          src={avatar}
          alt='avatar'
        />
        <h4 className={`${saira.className} font-semibold text-lg`}>{session?.user.username}</h4>
        {/* Submit */}
        <button
          className='block ml-auto px-2 py-1 bg-interex-blue rounded-sm font-semibold text-sm text-black'
          disabled={loading ? true : false}
          type='submit'
        >
          {loading ? (
            <p>Submitting...</p>
          ) : (
            <p>Create</p>
          )}
        </button>
      </div>
      <textarea
        className='bg-interex-comm-card px-3 py-1 w-full resize-y min-h-[100px] max-h-[300px] text-white'
        required
        value={comment.value}
        onChange={comment.handleChange}
      />
    </form>
  )
}

export default PostComment;
