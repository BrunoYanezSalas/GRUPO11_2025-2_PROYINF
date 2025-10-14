// src/api.js
import axios from 'axios';

// 1. Creamos una única instancia de Axios para toda la aplicación.
// Esta es la única fuente de verdad para la URL de nuestro backend.
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Corregido: Apunta al puerto 5000 del backend.
});

// 2. Exportamos cada función de la API de forma individual.
// Esto hace que sea más claro qué funciones están disponibles.

// --- Funciones de Autenticación y Usuarios ---

export const register = async (userData) => {
  // Asumimos que tienes funciones de registro y login, las adaptamos al nuevo formato.
  const response = await API.post('/usuarios/register', userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await API.post('/usuarios/login', userData);
  return response.data;
};

// --- Funciones para la HU6 (Seguimiento de Estudiantes) ---

/**
 * Obtiene la lista de todos los usuarios con el rol 'estudiante'.
 * @returns {Promise<Array<{id: number, nombre: string}>>} Una lista de estudiantes.
 */
export const getEstudiantes = async () => {
  try {
    const response = await API.get('/usuarios/estudiantes');
    return response.data;
  } catch (error) {
    console.error('Error al obtener la lista de estudiantes:', error);
    throw error;
  }
};

/**
 * Obtiene los resultados del último ensayo rendido por un estudiante específico.
 * @param {number|string} usuarioId El ID del estudiante a seguir.
 * @returns {Promise<Object|null>} El detalle del ensayo o null si no ha rendido ninguno.
 */
export const getSeguimientoEstudiante = async (usuarioId) => {
  try {
    const response = await API.get(`/resultados/seguimiento/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el seguimiento del estudiante:', error);
    // Si el error es un 404 (Not Found), significa que el estudiante no tiene ensayos.
    if (error.response && error.response.status === 404) {
      return null;
    }
    // Para otros errores, los lanzamos para que el componente los maneje.
    throw error;
  }
};

// (Aquí puedes agregar el resto de tus funciones de API, como getEnsayos, crearPregunta, etc.,
// siguiendo el mismo formato de usar la instancia `API`)

export default API;
