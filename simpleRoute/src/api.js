import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8090';
const config = {
  headers: {'Authorization': 'Basic dXNlcm5hbWU6cGFzc3dvcmQ='}
};

export const upvote = postId => {
  return axios.post(`/api/posts/${postId}/upvote`)
              .then(resp => resp.data);
};

export const getAll = () => {
   return axios.get('/api/v1/userPreferences', config)
   .set({'Authorization': 'Basic dXNlcm5hbWU6cGFzc3dvcmQ='})
              .then(resp => resp.data);
};

export const getPost = postId => {
  return axios.get(`/api/posts/${postId}`)
              .then(resp => resp.data);
};

export const add = (newTitle, newLink) => {
  return axios.post('/api/posts', { title: newTitle, link: newLink })
              .then(resp => resp.data);
};