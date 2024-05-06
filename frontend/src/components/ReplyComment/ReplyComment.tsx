'use client';

import React, { FormEvent, useState } from 'react';
import CommentService from '@/services/CommentService';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useFormInputText from '@/hooks/useFormInputText';
import Image from 'next/image';
import { saira } from '@/fonts';
import avatar from '../../assets/avatar.jpg';

const ReplyComment = ({
  threadId,
  commentId,
  setReplyOpen,
}: {
  threadId: string;
  commentId: string;
  setReplyOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const content = useFormInputText();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await CommentService.replyComment(session?.user.accessToken, threadId, commentId, content.value);

    // Refetches the data for communities.
    router.refresh();
    
    setLoading(false);
    setReplyOpen(false);
  }

  return (
    <form onSubmit={handleSubmit} className='ml-5 mb-4 p-4 bg-interex-comment-bg'>
      {/* Header */}
      <div className='mb-3 flex items-center gap-2'>
        <Image
          className='rounded-full w-8 border-white border-2'
          src={avatar}
          alt='avatar'
        />
        <h4 className={`${saira.className} font-semibold text-lg`}>{session?.user.name}</h4>
        {/* Close box */}
        <button
          className='flex items-center justify-center ml-auto w-6 h-6 border-[1px] border-zinc-500 hover:bg-zinc-100'
          type='button'
          onClick={() => setReplyOpen(false)}
        >
          <svg className='fill-white w-1/3' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>
        </button>
      </div>
      <textarea
        className='mb-2 bg-interex-comm-card px-3 py-1 w-full resize-y min-h-[100px] max-h-[300px] text-white'
        required
        value={content.value}
        onChange={content.handleChange}
      />
      {/* Submit */}
      <button
        className='block ml-auto px-2 py-1 bg-interex-blue rounded-sm font-semibold text-sm text-black'
        disabled={loading ? true : false}
        type='submit'
      >
        {loading ? (
          <p>Submitting...</p>
        ) : (
          <p>Reply</p>
        )}
      </button>
    </form>
  )
}

export default ReplyComment;
