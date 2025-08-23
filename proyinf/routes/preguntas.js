const express = require('express');
const router = express.Router();
const { Pregunta } = require('../models');

router.post('/', async (req, res) => {
  try {
    const pregunta = await Pregunta.create(req.body);
    res.status(201).json(pregunta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/ensayo/:ensayoId', async (req, res) => {
  try {
    const preguntas = await Pregunta.findAll({ where: { ensayoId: req.params.ensayoId } });
    res.json(preguntas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
