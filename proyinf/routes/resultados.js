const express = require('express');
const router = express.Router();
const { Respuesta } = require('../models');

router.get('/:usuarioId/:ensayoId', async (req, res) => {
  const { usuarioId, ensayoId } = req.params;

  try {
    const respuestas = await Respuesta.findAll({
      where: { usuarioId, ensayoId }
    });

    const total = respuestas.length;
    const correctas = respuestas.filter(r => r.correcta).length;
    const puntaje = total > 0 ? Math.round((correctas / total) * 100) : 0;

    res.json({
      usuarioId: parseInt(usuarioId),
      ensayoId: parseInt(ensayoId),
      totalPreguntas: total,
      respuestasCorrectas: correctas,
      puntaje
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
