const express = require('express');
const router = express.Router();
const { Respuesta } = require('../models');
const { Resultado, Respuesta, Pregunta, Ensayo, Usuario } = require('../models');
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
// GET para seguimiento de un estudiante específico
router.get('/seguimiento/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;

  try {
    // 1. Encontrar la última respuesta del usuario para saber cuál fue el último ensayo
    const ultimaRespuesta = await Respuesta.findOne({
      where: { usuarioId },
      order: [['createdAt', 'DESC']],
      include: [{ model: Pregunta, include: [Ensayo] }]
    });

    if (!ultimaRespuesta) {
      return res.status(404).json({ message: 'El estudiante aún no ha rendido ensayos.' });
    }

    const ultimoEnsayoId = ultimaRespuesta.Pregunta.Ensayo.id;
    const nombreUltimoEnsayo = ultimaRespuesta.Pregunta.Ensayo.titulo;

    // 2. Obtener todas las respuestas de ese usuario para ese ensayo en específico
    const respuestasDelEnsayo = await Respuesta.findAll({
      where: {
        usuarioId: usuarioId,
      },
      include: [
        {
          model: Pregunta,
          where: { ensayoId: ultimoEnsayoId },
          required: true // Asegura que solo traiga respuestas de ese ensayo
        },
      ],
      order: [[Pregunta, 'id', 'ASC']] // Ordenar por el ID de la pregunta
    });

    // 3. Formatear la respuesta para el frontend
    const resultadoFormateado = respuestasDelEnsayo.map(r => ({
      preguntaId: r.Pregunta.id,
      enunciado: r.Pregunta.enunciado,
      alternativaCorrecta: r.Pregunta.alternativa_correcta,
      respuestaEstudiante: r.respuesta_seleccionada,
      esCorrecta: r.Pregunta.alternativa_correcta === r.respuesta_seleccionada
    }));

    res.json({
      nombreEnsayo: nombreUltimoEnsayo,
      respuestas: resultadoFormateado
    });

  } catch (error) {
    console.error('Error en el seguimiento del estudiante:', error);
    res.status(500).json({ error: 'Error al obtener el seguimiento del estudiante' });
  }
});
module.exports = router;
