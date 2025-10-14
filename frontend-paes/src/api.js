// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api', // cambia si tu backend está en otro puerto
});

export default API;

export const getEstudiantes = async () => {
  try {
    const response = await axios.get(`${API_URL}/usuarios/estudiantes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching estudiantes:', error);
    throw error;
  }
};

// Obtener los resultados del último ensayo de un estudiante
export const getSeguimientoEstudiante = async (usuarioId) => {
  try {
    const response = await axios.get(`${API_URL}/resultados/seguimiento/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching seguimiento:', error);
    if (error.response && error.response.status === 404) {
      return null; // Devuelve null si el estudiante no tiene ensayos
    }
    throw error;
  }
};