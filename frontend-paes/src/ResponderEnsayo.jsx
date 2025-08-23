import React, { useEffect, useState } from 'react';
import API from './api';
import { useUser } from './UserContext';

function ResponderEnsayo() {
  const { user } = useUser();

  const [ensayos, setEnsayos] = useState([]);
  const [ensayoId, setEnsayoId] = useState('');
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});

  useEffect(() => {
    API.get('/ensayos')
      .then(res => setEnsayos(res.data))
      .catch(() => alert('❌ Error al cargar ensayos'));
  }, []);

  const buscarPreguntas = async () => {
    try {
      const res = await API.get(`/preguntas/ensayo/${ensayoId}`);
      setPreguntas(res.data);
    } catch (err) {
      alert('❌ Error al obtener preguntas');
    }
  };

  const handleChange = (preguntaId, seleccionada) => {
    setRespuestas({ ...respuestas, [preguntaId]: seleccionada });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      usuarioId: user.id,
      ensayoId: parseInt(ensayoId),
      respuestas: Object.entries(respuestas).map(([preguntaId, seleccionada]) => ({
        preguntaId: parseInt(preguntaId),
        seleccionada
      }))
    };
    try {
      await API.post('/respuestas', payload);
      alert('✅ Respuestas enviadas');
    } catch (err) {
      alert('❌ Error al enviar respuestas');
    }
  };

  return (
    <div>
      <h2>Responder Ensayo</h2>

      <select value={ensayoId} onChange={e => setEnsayoId(e.target.value)} required>
        <option value="">-- Selecciona un ensayo --</option>
        {ensayos.map(e => (
          <option key={e.id} value={e.id}>
            {e.titulo} — {e.materia}
          </option>
        ))}
      </select>

      <p><small>Respondiendo como: {user?.nombre} (ID: {user?.id})</small></p>

      <button onClick={buscarPreguntas}>Cargar Preguntas</button>

      <form onSubmit={handleSubmit}>
        {preguntas.map(p => (
          <div key={p.id}>
            <p><strong>{p.enunciado}</strong></p>
            {Object.entries(p.alternativas).map(([letra, texto]) => (
              <label key={letra}>
                <input
                  type="radio"
                  name={`pregunta_${p.id}`}
                  value={letra}
                  onChange={() => handleChange(p.id, letra)}
                  required
                />
                {letra}) {texto}
              </label>
            ))}
            <hr />
          </div>
        ))}
        {preguntas.length > 0 && <button type="submit">Enviar Respuestas</button>}
      </form>
    </div>
  );
}

export default ResponderEnsayo;
