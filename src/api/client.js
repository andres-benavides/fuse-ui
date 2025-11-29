import axios from 'axios';

const api = axios.create({
  baseURL: 'https://fuse-api-5ca6ca59c7a6.herokuapp.com/api/v1',
});

export default api;