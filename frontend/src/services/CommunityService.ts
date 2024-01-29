import { Community, CreateCommunityPayload } from '@/types/communities';
import { BACKEND_URL, Token, parseJSON } from './helpers';

const BASE_URL = `${BACKEND_URL}/communities`;

class CommunityService {
  getAllCommunities = async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    };

    const response = await parseJSON(`${BASE_URL}/`, options);
    return response.communities as Community[];
  }

  getAllCategories = async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    };

    const response = await parseJSON(`${BASE_URL}/categories`, options);
    return response.categories;
  }

  createCommunity = async (token: Token, payload: CreateCommunityPayload) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(payload)
    };

    const response = await parseJSON(`${BASE_URL}/new`, options);
    return response.community;
  }
}

export default new CommunityService();