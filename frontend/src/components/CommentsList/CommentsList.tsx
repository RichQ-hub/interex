import React from 'react';
import CommentCard from '../CommentCard';
import { Comment } from '@/types/comments';

const CommentsList = ({
  comments,
}: {
  comments: Comment[];
}) => {
  return (
    <ul>
      {/* Comment */}
      {comments.map((comment, idx) => {
        return (
          <CommentCard
            key={idx}
            id={comment.id}
            author={comment.author}
            content={comment.content}
            replies={comment.replies}
          />
        ) 
      })}
    </ul>
  )
}

export default CommentsList;
