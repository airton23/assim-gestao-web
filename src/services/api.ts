import axios from 'axios';

export const BASE_URL = 'https://comerciovidaagroecologica.ufape.edu.br';

axios.defaults.withCredentials = true;

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
