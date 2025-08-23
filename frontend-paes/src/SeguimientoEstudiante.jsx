// src/SeguimientoEstudiante.jsx
import React, { useEffect, useState } from 'react';
import API from './api';
import { useUser } from './UserContext';

function SeguimientoEstudiante() {
  const { user } = useUser();
  const [estudiantes, setEstudiantes] = useState([]);
  const [usuarioId, setUsuarioId] = useState('');
  const [datos, setDatos] = useState(null);

  // Cargar estudiantes al iniciar
  useEffect(() => {
    const cargarEstudiantes = async () => {
      try {
        const res = await API.get('/usuarios?rol=estudiante');
        setEstudiantes(res.data);
      } catch (err) {
        alert('❌ Error al cargar estudiantes');
      }
    };
    cargarEstudiantes();
  }, []);

  const cargarSeguimiento = async () => {
    try {
      const res = await API.get(`/respuestas/ultimo/${usuarioId}`);
      setDatos(res.data);
    } catch (err) {
      alert('❌ No se pudo cargar el rendimiento del estudiante');
    }
  };

  if (user?.rol !== 'docente') {
    return <p>🔒 Solo los docentes pueden acceder al seguimiento de estudiantes.</p>;
  }

  return (
    <div>
      <h2>👨‍🏫 Seguimiento de Estudiantes</h2>

      <select value={usuarioId} onChange={e => setUsuarioId(e.target.value)} required>
        <option value=''>-- Selecciona un estudiante --</option>
        {estudiantes.map(est => (
          <option key={est.id} value={est.id}>
            {est.nombre} (ID: {est.id})
          </option>
        ))}
      </select>

      <button onClick={cargarSeguimiento} disabled={!usuarioId}>
        Ver Rendimiento
      </button>

      {datos && (
        <div>
          <h3>📄 Último Ensayo: {datos.ensayo?.titulo} ({datos.ensayo?.materia})</h3>
          <ul>
            {datos.respuestas.map((r, idx) => (
              <li key={idx}>
                <strong>{r.pregunta}</strong><br />
                Seleccionada: <code>{r.seleccionada}</code>{' '}
                — {r.correcta ? '✅ Correcta' : '❌ Incorrecta'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SeguimientoEstudiante;
