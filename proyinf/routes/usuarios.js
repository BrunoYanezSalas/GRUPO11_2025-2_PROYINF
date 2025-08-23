const express = require('express');
const router = express.Router();
const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');



router.post('/register', async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await Usuario.create({ nombre, email, password: hashedPassword, rol });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await Usuario.findOne({ where: { email } });
  if (user && await bcrypt.compare(password, user.password)) {
    res.json({ message: 'Login exitoso', usuario: user });
  } else {
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
});

module.exports = router;
