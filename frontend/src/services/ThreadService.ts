import { BACKEND_URL, Token, parseJSON } from './helpers';
import { CreateThreadPayload, ThreadCard, ThreadDetails } from '@/types/threads';

const BASE_URL = `${BACKEND_URL}/threads`;

class CommunityService {
  getAllThreads = async (communityId: string) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    };

    const response = await parseJSON(`${BASE_URL}/${communityId}`, options);
    return response.threads as ThreadCard[];
  }

  getThreadDetails = async (threadId: string) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    };

    const response = await parseJSON(`${BASE_URL}/details/${threadId}`, options);
    return response as ThreadDetails;
  }

  createThread = async (token: Token, communityId: string, payload: CreateThreadPayload) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(payload)
    };

    const response = await parseJSON(`${BASE_URL}/${communityId}`, options);
    return response.newThread;
  }
}

const service = new CommunityService();

export default service;
