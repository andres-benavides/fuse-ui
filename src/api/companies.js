import api from './client';

export function fetchCompanies() {
  return api.get('/companies');
}
