import { Community, CreateCategoryPayload, CreateCommunityPayload } from '@/types/communities';
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

  createCategory = async (token: Token, payload: CreateCategoryPayload) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(payload)
    };

    const response = await parseJSON(`${BASE_URL}/category/new`, options);
    return response.category;
  }

  searchCommunities = async (query: string, sortBy: string, pageSize: string) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    };

    const searchParams = new URLSearchParams();
    searchParams.set('query', query);
    searchParams.set('sortBy', sortBy);
    searchParams.set('pageSize', pageSize);

    const response = await parseJSON(`${BASE_URL}/search?${searchParams.toString()}`, options);
    return response.communities as Community[];
  }
}

export default new CommunityService();