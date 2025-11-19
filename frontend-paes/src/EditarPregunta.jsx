// src/EditarPregunta.jsx

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // 1. Importar PropTypes para la validación
import API from './api';

// El componente recibe y usa las props preguntaId y onVolver
function EditarPregunta({ preguntaId, onVolver }) {
  const [pregunta, setPregunta] = useState(null);
  const [form, setForm] = useState({
    enunciado: '',
    alternativaA: '',
    alternativaB: '',
    alternativaC: '',
    correcta: ''
  });

  // Cargar datos de la pregunta al montar
  useEffect(() => {
    const fetchPregunta = async () => {
      try {
        const res = await API.get(`/preguntas/${preguntaId}`);
        const p = res.data;
        setPregunta(p);
        setForm({
          enunciado: p.enunciado,
          alternativaA: p.alternativas.a,
          alternativaB: p.alternativas.b,
          alternativaC: p.alternativas.c,
          correcta: p.correcta
        });
      } catch (err) {
        // 2. Manejo de error mejorado: loguear el error y notificar
        console.error('Error al cargar la pregunta:', err);
        alert('❌ Error al cargar la pregunta');
      }
    };
    if (preguntaId) fetchPregunta();
  }, [preguntaId]);

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
      correcta: form.correcta
    };
    try {
      await API.put(`/preguntas/${preguntaId}`, payload);
      alert('✅ Pregunta actualizada correctamente');
      if (onVolver) onVolver();
    } catch (err) {
      // 2. Manejo de error mejorado: loguear el error y notificar
      console.error('Error al actualizar pregunta:', err);
      alert('❌ Error al actualizar pregunta');
    }
  };

  if (!pregunta) return <p>Cargando pregunta...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>✏️ Editar Pregunta</h2>
      <input name="enunciado" value={form.enunciado} onChange={handleChange} required />
      <input name="alternativaA" value={form.alternativaA} onChange={handleChange} required />
      <input name="alternativaB" value={form.alternativaB} onChange={handleChange} required />
      <input name="alternativaC" value={form.alternativaC} onChange={handleChange} required />
      <select name="correcta" value={form.correcta} onChange={handleChange} required>
        <option value=''>-- Correcta --</option>
        <option value='a'>A</option>
        <option value='b'>B</option>
        <option value='c'>C</option>
      </select>
      <button type="submit">💾 Guardar Cambios</button>
      <button type="button" onClick={onVolver}>↩️ Volver</button>
    </form>
  );
}

// 1. Validación de Propiedades para mejorar la Mantenibilidad y Fiabilidad
EditarPregunta.propTypes = {
  // preguntaId es esencial y debe ser de tipo string o number
  preguntaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, 
  // onVolver es opcional, pero si se pasa, debe ser una función
  onVolver: PropTypes.func, 
};

export default EditarPregunta;