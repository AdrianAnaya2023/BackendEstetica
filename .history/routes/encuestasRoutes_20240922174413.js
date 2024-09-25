// routes/encuestasRoutes.js
const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Crear una nueva encuesta
router.post('/encuestas', async (req, res) => {
  const { pregunta, bueno, malo, regular } = req.body;
  try {
    const nuevaEncuesta = await prisma.encuestas.create({
      data: { pregunta, bueno, malo, regular },
    });
    res.status(201).json(nuevaEncuesta);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la encuesta' });
  }
});

// Obtener todas las encuestas
router.get('/encuestas', async (req, res) => {
  try {
    const encuestas = await prisma.encuestas.findMany();
    res.json(encuestas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las encuestas' });
  }
});

// Obtener una encuesta por ID
router.get('/encuestas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const encuesta = await prisma.encuestas.findUnique({
      where: { id: parseInt(id) },
    });
    if (!encuesta) return res.status(404).json({ error: 'Encuesta no encontrada' });
    res.json(encuesta);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la encuesta' });
  }
});

// Actualizar una encuesta
router.put('/encuestas/:id', async (req, res) => {
  const { id } = req.params;
  const { pregunta, bueno, malo, regular } = req.body;
  try {
    const encuestaActualizada = await prisma.encuestas.update({
      where: { id: parseInt(id) },
      data: { pregunta, bueno, malo, regular },
    });
    res.json(encuestaActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la encuesta' });
  }
});

// Eliminar una encuesta
router.delete('/encuestas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.encuestas.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la encuesta' });
  }
});

module.exports = router;
