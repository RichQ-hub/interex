import React from 'react';
import CommentCard from '../CommentCard';
import CommentService from '@/services/CommentService';

const CommentsList = async ({
  threadId,
}: {
  threadId: string;
}) => {
  const comments = await CommentService.getComments(threadId);
  return (
    <ul>
      {/* Comment */}
      {comments.map((comment) => {
        return (
          <CommentCard
            key={comment.id}
            threadId={threadId}
            details={comment}
          />
        ) 
      })}
    </ul>
  )
}

export default CommentsList;
