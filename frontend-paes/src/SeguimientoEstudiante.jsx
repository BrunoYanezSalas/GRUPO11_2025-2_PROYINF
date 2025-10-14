// frontend-paes/src/SeguimientoEstudiante.jsx

import React, { useState, useEffect } from 'react';
import { getEstudiantes, getSeguimientoEstudiante } from './api';

const SeguimientoEstudiante = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [seguimiento, setSeguimiento] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar la lista de estudiantes al montar el componente
  useEffect(() => {
    const loadEstudiantes = async () => {
      try {
        const data = await getEstudiantes();
        setEstudiantes(data);
      } catch (err) {
        setError('No se pudo cargar la lista de estudiantes.');
      }
    };
    loadEstudiantes();
  }, []);

  // Manejar el cambio en el selector de estudiante
  const handleStudentChange = async (e) => {
    const studentId = e.target.value;
    setSelectedStudentId(studentId);
    
    if (!studentId) {
      setSeguimiento(null);
      setError('');
      return;
    }

    setLoading(true);
    setError('');
    setSeguimiento(null);

    try {
      const data = await getSeguimientoEstudiante(studentId);
      if (data) {
        setSeguimiento(data);
      } else {
        setError('Este estudiante aún no ha rendido ningún ensayo.');
      }
    } catch (err) {
      setError('Error al obtener el rendimiento del estudiante.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Seguimiento de Estudiantes</h2>
      
      {/* Selector de Estudiantes */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="student-select">Selecciona un estudiante: </label>
        <select id="student-select" value={selectedStudentId} onChange={handleStudentChange}>
          <option value="">-- Elige un estudiante --</option>
          {estudiantes.map((est) => (
            <option key={est.id} value={est.id}>
              {est.nombre} (ID: {est.id})
            </option>
          ))}
        </select>
      </div>

      {/* Muestra de Resultados */}
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {seguimiento && (
        <div>
          <h3>Último Ensayo Rendido: {seguimiento.nombreEnsayo}</h3>
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Pregunta</th>
                <th>Respuesta del Estudiante</th>
                <th>Respuesta Correcta</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              {seguimiento.respuestas.map((item) => (
                <tr key={item.preguntaId}>
                  <td>{item.enunciado}</td>
                  <td>{item.respuestaEstudiante}</td>
                  <td>{item.alternativaCorrecta}</td>
                  <td style={{ color: item.esCorrecta ? 'green' : 'red', fontWeight: 'bold' }}>
                    {item.esCorrecta ? 'Correcta' : 'Incorrecta'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SeguimientoEstudiante;