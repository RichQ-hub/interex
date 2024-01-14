import { Community } from '@/types/communities';
import { BACKEND_URL, parseJSON } from './helpers';

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
}

export default new CommunityService();