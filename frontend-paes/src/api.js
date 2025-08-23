// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api', // cambia si tu backend está en otro puerto
});

export default API;
