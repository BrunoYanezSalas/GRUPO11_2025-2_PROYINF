const express = require('express');
const router = express.Router();
const { Respuesta, Pregunta } = require('../models');

router.post('/', async (req, res) => {
  const { usuarioId, ensayoId, respuestas } = req.body;

  try {
    const procesadas = await Promise.all(respuestas.map(async r => {
      const pregunta = await Pregunta.findByPk(r.preguntaId);
      const correcta = pregunta.correcta === r.seleccionada;
      return await Respuesta.create({
        usuarioId,
        ensayoId,
        preguntaId: r.preguntaId,
        seleccionada: r.seleccionada,
        correcta
      });
    }));
    res.status(201).json(procesadas);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
