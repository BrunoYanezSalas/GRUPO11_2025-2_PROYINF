// src/ListaEnsayos.jsx
import React, { useEffect, useState } from 'react';
import API from './api';

function ListaEnsayos() {
  const [ensayos, setEnsayos] = useState([]);

  useEffect(() => {
    const fetchEnsayos = async () => {
      try {
        const res = await API.get('/ensayos');
        setEnsayos(res.data);
      } catch (err) {
        alert('❌ Error al obtener ensayos');
      }
    };
    fetchEnsayos();
  }, []);

  const eliminarEnsayo = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este ensayo?')) return;

    try {
      await API.delete(`/ensayos/${id}`);
      setEnsayos(ensayos.filter(e => e.id !== id));
      alert('✅ Ensayo eliminado');
    } catch (err) {
      alert('❌ Error al eliminar ensayo');
    }
  };

  return (
    <div>
      <h2>Lista de Ensayos</h2>
      <ul>
        {ensayos.map((e) => (
          <li key={e.id}>
            <strong>ID:</strong> {e.id} — <strong>{e.titulo}</strong> – {e.materia} ({e.fecha?.slice(0, 10)})
            {' '}<button onClick={() => eliminarEnsayo(e.id)}>🗑️ Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaEnsayos;
