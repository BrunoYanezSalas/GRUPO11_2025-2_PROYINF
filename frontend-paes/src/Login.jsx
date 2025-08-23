// src/Login.jsx
import React, { useState } from 'react';
import API from './api';
import { useUser } from './UserContext'; // 👈 importar contexto

function Login() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const { setUser } = useUser(); // 👈 usamos el setter del contexto

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/usuarios/login', form);
      setUser(res.data.usuario); // 👈 guardamos al usuario en contexto
      alert('✅ Login exitoso: ' + res.data.usuario.nombre);
    } catch (err) {
      alert('❌ Credenciales inválidas');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar Sesión</h2>
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />
      <button type="submit">Ingresar</button>
    </form>
  );
}

export default Login;
