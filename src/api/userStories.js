import api from './client';

export function createUserStoryWithTicket(projectId, payload) {
  return api.post(`/projects/${projectId}/user_stories`, payload);
}

export function fetchUserStories(projectId) {
  return api.get(`/projects/${projectId}/user_stories`);
}