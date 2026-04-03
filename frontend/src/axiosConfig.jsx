import axios from 'axios';

const axiosInstance = axios.create({
  //baseURL: 'http://localhost:6001', // local
  baseURL: '', // production: same host, proxied via Nginx
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
