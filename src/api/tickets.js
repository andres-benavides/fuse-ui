import api from './client';

export function fetchMyTickets(userId, filters = {}) {
  return api.get('/tickets', {
    params: { user_id: userId, ...filters },
  });
}

export function createTicketForStory(userStoryId, payload) {
  return api.post(`/user_stories/${userStoryId}/tickets`, payload);
}

export function updateTicket(userStoryId, ticketId, payload) {
  return api.put(`/user_stories/${userStoryId}/tickets/${ticketId}`, payload);
}

export function cancelTicket(ticketId) {
  return api.post(`/tickets/${ticketId}/cancel`);
}

