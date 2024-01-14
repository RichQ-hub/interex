import { BACKEND_URL, parseJSON } from './helpers';

const BASE_URL = `${BACKEND_URL}/auth`;

class AuthService {
  register = async (email: string, username: string, password: string) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        username,
        password
      })
    };

    const response = await parseJSON(`${BASE_URL}/register`, options);
    return response.user;
  }

  login = async (email: string, password: string) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      })
    };

    const response = await parseJSON(`${BASE_URL}/login`, options);
    return response;
  }
}

export default new AuthService();