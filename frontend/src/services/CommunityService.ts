import { Category, Community, CommunityDetails, CreateCategoryPayload, CreateCommunityPayload, CreateFlairPayload, FlairDetails } from '@/types/communities';
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

  getCommunityDetails = async (communityId: string) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    };

    const response = await parseJSON(`${BASE_URL}/${communityId}`, options);
    return response as CommunityDetails;
  }

  getAllCategories = async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    };

    const response = await parseJSON(`${BASE_URL}/categories`, options);
    return response.categories as Category[];
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

    const response = await parseJSON(`${BASE_URL}/create`, options);
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

    const response = await parseJSON(`${BASE_URL}/category/create`, options);
    return response.category;
  }

  createFlair = async (token: Token, communityId: string, payload: CreateFlairPayload) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(payload)
    };

    const response = await parseJSON(`${BASE_URL}/flair/create/${communityId}`, options);
    return response.flair;
  }

  searchCommunities = async (query: string, sortBy: string, pageSize: string, category: string | string[]) => {
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

    if (Array.isArray(category)) {
      category.forEach((cat) => {
        searchParams.append('category', cat);
      });
    } else if (category) {
      searchParams.set('category', category);
    }

    const response = await parseJSON(`${BASE_URL}/search?${searchParams.toString()}`, options);
    return response.communities as Community[];
  }

  getAllFlairs = async (communityId: string) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    };

    const response = await parseJSON(`${BASE_URL}/flair/${communityId}`, options);
    return response.flairs as FlairDetails[];
  }
}

const service = new CommunityService();

export default service;