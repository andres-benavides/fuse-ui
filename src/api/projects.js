import api from './client';

export function fetchProjects(companyId) {
  return api.get('/projects', {
    params: { company_id: companyId },
  });
}
