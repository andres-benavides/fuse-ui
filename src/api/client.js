import axios from 'axios';

const api = axios.create({
  baseURL: 'https://fuse-api.herokuapp.com/api/v1',
});

export default api;