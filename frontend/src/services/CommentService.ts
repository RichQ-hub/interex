import { Comment } from '@/types/comments';
import { BACKEND_URL, parseJSON } from './helpers';

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
}

const service = new CommentService();

export default service;