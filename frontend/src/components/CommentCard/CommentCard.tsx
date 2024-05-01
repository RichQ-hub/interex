import { Comment } from '@/types/comments';
import Image from 'next/image';
import React from 'react';
import avatar from '../../assets/avatar.jpg';
import CommentsList from '../CommentsList';
import { saira } from '@/fonts';

/** Works alongside CommentsList component, which also recursively renders the replies
 * by rendering CommentCard component again.
 */
const CommentCard = ({
  id,
  author,
  content,
  replies,
}: {
  id: string;
  author: string;
  content: string;
  replies: Comment[];
}) => {
  return (
    <li className='border-l-2 border-l-interex-comment-bg'>
      {/* Comment Card Part */}
      <div className='mb-5 p-4 bg-interex-comment-bg'>
        {/* Header */}
        <div className='mb-1 flex items-center gap-2'>
          <Image
            className='rounded-full w-8 border-white border-2'
            src={avatar}
            alt='avatar'
          />
          <h4 className={`${saira.className} font-semibold text-lg`}>{author}</h4>

          {/* Posted Date */}
          <span className='ml-auto italic text-sm'><span className='underline'>Posted</span>: Sep 14, 2010</span>
        </div>

        {/* Content */}
        <p>{content}</p>

        {/* Footer */}
      </div>

      {/* Replies Wrapper (To shift to the right to give a sense of hierarchy). */}
      {replies.length !== 0 &&
        <div className='ml-5'>
          <CommentsList comments={replies} />
        </div>
      }
    </li>
  )
}

export default CommentCard;
