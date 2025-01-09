import axios from 'axios';
import { baseUrl } from './base';

export const login = async (username, password) => {
  const response = await axios.post(`${baseUrl}/auth/login/`, {
    username,
    password,
  });
  return response.data;
};
