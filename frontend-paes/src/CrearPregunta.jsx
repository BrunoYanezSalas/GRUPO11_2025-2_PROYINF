// src/CrearPregunta.jsx
import React, { useEffect, useState } from 'react';
import API from './api';
import { useUser } from './UserContext'; // 👈 importar contexto

function CrearPregunta() {
  const { user } = useUser(); // 👈 obtener usuario logueado

  const [form, setForm] = useState({
    enunciado: '',
    alternativaA: '',
    alternativaB: '',
    alternativaC: '',
    correcta: '',
    ensayoId: ''
  });

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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      enunciado: form.enunciado,
      alternativas: {
        a: form.alternativaA,
        b: form.alternativaB,
        c: form.alternativaC
      },
      correcta: form.correcta,
      ensayoId: form.ensayoId,
      autorId: user?.id // 👈 si lo necesitas más adelante en el backend
    };

    try {
      const res = await API.post('/preguntas', payload);
      alert('✅ Pregunta creada: ' + res.data.enunciado);
    } catch (err) {
      alert('❌ Error al crear pregunta');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Pregunta</h2>
      <input name="enunciado" placeholder="Enunciado" onChange={handleChange} required />
      <input name="alternativaA" placeholder="Alternativa A" onChange={handleChange} required />
      <input name="alternativaB" placeholder="Alternativa B" onChange={handleChange} required />
      <input name="alternativaC" placeholder="Alternativa C" onChange={handleChange} required />
      <select name="correcta" onChange={handleChange} required>
        <option value="">-- Alternativa Correcta --</option>
        <option value="a">A</option>
        <option value="b">B</option>
        <option value="c">C</option>
      </select>

      <select name="ensayoId" onChange={handleChange} required>
        <option value="">-- Seleccionar Ensayo --</option>
        {ensayos.map(e => (
          <option key={e.id} value={e.id}>
            {e.titulo} ({e.materia})
          </option>
        ))}
      </select>

      {/* Mostrar autor actual */}
      <p><small>Autor: {user?.nombre} (ID: {user?.id})</small></p>
      <button type="submit">Crear Pregunta</button>
    </form>
  );
}

export default CrearPregunta;
