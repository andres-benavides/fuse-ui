import api from './client';

export function signup(payload) {
  return api.post('/signup', { user: payload });
}

export function login(payload) {
  return api.post('/login', payload);
}