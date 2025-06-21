import React from 'react';
import CommentService from '@/services/CommentService';
import CommentCard from '../CommentCard';

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
