import axios from 'axios';

const backend_api = axios.create({
  baseURL: 'http://localhost:3000/', // Replace with your backend API URL
});

// const smth = await backend_api.get('/resumes');

// console.log(smth.data);

export default backend_api;