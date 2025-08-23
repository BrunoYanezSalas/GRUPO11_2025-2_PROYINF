// src/Register.jsx
import React, { useState } from 'react';
import API from './api';

function Register() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'estudiante'
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/usuarios/register', form);
      alert('✅ Usuario registrado: ' + res.data.nombre);
    } catch (err) {
      alert('❌ Error: ' + err.response?.data?.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro</h2>
      <input name="nombre" placeholder="Nombre" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />
      <select name="rol" onChange={handleChange}>
        <option value="estudiante">Estudiante</option>
        <option value="docente">Docente</option>
      </select>
      <button type="submit">Registrarse</button>
    </form>
  );
}

export default Register;
