import api from './client';

export function registerUser(payload) {
  return api.post('/signup', payload);
}
