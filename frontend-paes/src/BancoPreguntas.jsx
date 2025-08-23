// src/BancoPreguntas.jsx
import React, { useEffect, useState } from 'react';
import API from './api';
import EditarPregunta from './EditarPregunta';

function BancoPreguntas() {
  const [preguntas, setPreguntas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    API.get('/preguntas/todas') // Necesitarás crear este endpoint si no existe
      .then(res => setPreguntas(res.data))
      .catch(() => alert('Error al cargar preguntas'));
  }, []);

  // Agrupar por materia y submateria si es ciencia
  const agrupadas = preguntas.reduce((acc, p) => {
    const materia = p.Ensayo?.materia || 'Otra';
    const submateria = materia.includes('Ciencias') ? p.subrama || 'General' : null;

    if (!acc[materia]) acc[materia] = {};

    if (submateria) {
      if (!acc[materia][submateria]) acc[materia][submateria] = [];
      acc[materia][submateria].push(p);
    } else {
      if (!acc[materia].General) acc[materia].General = [];
      acc[materia].General.push(p);
    }

    return acc;
  }, {});

  if (editandoId) {
    return (
      <EditarPregunta
        preguntaId={editandoId}
        onVolver={() => setEditandoId(null)}
      />
    );
  }

  return (
    <div>
      <h2>📚 Banco de Preguntas</h2>

      {Object.entries(agrupadas).map(([materia, subgrupo]) => (
        <div key={materia}>
          <h3>📘 {materia}</h3>
          {Object.entries(subgrupo).map(([sub, lista]) => (
            <div key={sub} style={{ marginLeft: '20px' }}>
              <h4>🔹 {sub}</h4>
              <ul>
                {lista.map(p => (
                  <li key={p.id}>
                    {p.enunciado} {' '}
                    <button onClick={() => setEditandoId(p.id)}>✏️ Editar</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default BancoPreguntas;
