// src/CrearEnsayo.jsx
import React, { useState } from 'react';
import API from './api';
import { useUser } from './UserContext'; // 👈 Importar el contexto

function CrearEnsayo() {
  const { user } = useUser(); // 👈 Obtener usuario actual

  const [form, setForm] = useState({
    titulo: '',
    fecha: '',
    materia: ''
    // docenteId ya no se incluye aquí porque lo tomamos del contexto
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      docenteId: user?.id // 👈 Agregamos el ID desde el usuario logueado
    };

    try {
      const res = await API.post('/ensayos', payload);
      alert('✅ Ensayo creado: ' + res.data.titulo);
    } catch (err) {
      alert('❌ Error al crear ensayo: ' + err.response?.data?.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Ensayo</h2>
      <input name="titulo" placeholder="Título" onChange={handleChange} required />
      <input name="fecha" type="date" onChange={handleChange} required />
      <input name="materia" placeholder="Materia" onChange={handleChange} required />
      {/* No se necesita campo docenteId */}
      <p><small>Creando como: {user?.nombre} (ID: {user?.id})</small></p>
      <button type="submit">Crear Ensayo</button>
    </form>
  );
}

export default CrearEnsayo;
