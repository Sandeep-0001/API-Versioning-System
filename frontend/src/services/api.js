import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createUserV1 = async (data) => {
  return await api.post('/v1/users', data);
};

export const createUserV2 = async (data) => {
  return await api.post('/v2/users', data);
};

export const createUserV3 = async (data) => {
  return await api.post('/v3/users', data);
};

export const getUsersV1 = async () => {
  return await api.get('/v1/users');
};

export const getUsersV2 = async () => {
  return await api.get('/v2/users');
};

export const getUsersV3 = async () => {
  return await api.get('/v3/users');
};

export default api;
