// src/VerResultado.jsx
import React, { useEffect, useState } from 'react';
import API from './api';
import { useUser } from './UserContext';

function VerResultado() {
  const { user } = useUser();
  const [ensayos, setEnsayos] = useState([]);
  const [ensayoId, setEnsayoId] = useState('');
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    API.get('/ensayos')
      .then(res => setEnsayos(res.data))
      .catch(() => alert('❌ Error al cargar ensayos'));
  }, []);

  const buscarResultado = async () => {
    try {
      const res = await API.get(`/resultados/${user.id}/${ensayoId}`);
      setResultado(res.data);
    } catch (err) {
      alert('❌ Error al obtener el resultado');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h2>Ver Resultado</h2>

      <select value={ensayoId} onChange={e => setEnsayoId(e.target.value)} required>
        <option value="">-- Selecciona un ensayo --</option>
        {ensayos.map(e => (
          <option key={e.id} value={e.id}>
            {e.titulo} — {e.materia}
          </option>
        ))}
      </select>

      <p><small>Mostrando resultados para: {user?.nombre} (ID: {user?.id})</small></p>
      <button onClick={buscarResultado}>Buscar Resultado</button>

      {resultado && (
        <div>
          <h3>Resultado</h3>
          <p><strong>Total Preguntas:</strong> {resultado.total}</p>
          <p><strong>Correctas:</strong> {resultado.correctas}</p>
          <p><strong>Puntaje:</strong> {resultado.puntaje}</p>
        </div>
      )}
    </div>
  );
}

export default VerResultado;
