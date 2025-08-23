const express = require('express');
const router = express.Router();
const { Ensayo } = require('../models');

router.post('/', async (req, res) => {
  try {
    const ensayo = await Ensayo.create(req.body);
    res.status(201).json(ensayo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const ensayos = await Ensayo.findAll();
    res.json(ensayos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
