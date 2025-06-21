import { Comment } from '@/types/comments';
import { BACKEND_URL, Token, parseJSON } from './helpers';

const BASE_URL = `${BACKEND_URL}/comments`;

class CommentService {
  getComments = async (threadId: string) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    };

    const response = await parseJSON(`${BASE_URL}/${threadId}`, options);
    return response.comments as Comment[];
  }

  createComment = async (token: Token, threadId: string, content: string) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        content,
      })
    };

    const response = await parseJSON(`${BASE_URL}/${threadId}`, options);
    return response.comment;
  }

  replyComment = async (token: Token, threadId: string, commentId: string, content: string) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        content,
      })
    };

    const response = await parseJSON(`${BASE_URL}/reply/${threadId}/${commentId}`, options);
    return response.comment;
  }
}

const service = new CommentService();

export default service;