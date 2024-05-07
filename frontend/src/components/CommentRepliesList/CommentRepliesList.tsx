import { Comment } from '@/types/comments';
import React from 'react'
import CommentCard from '@/components/CommentCard';

const CommentRepliesList = ({
  threadId,
  replies,
}: {
  threadId: string;
  replies: Comment[];
}) => {
  return (
    <ul className='ml-5'>
      {/* Comment */}
      {replies.map((reply) => {
        return (
          <CommentCard
            key={reply.id}
            threadId={threadId}
            details={reply}
          />
        ) 
      })}
    </ul>
  )
}

export default CommentRepliesList;
