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
    // Convertir id de BigInt a String si es necesario
    res.status(201).json({ ...nuevaEncuesta, id: nuevaEncuesta.id.toString() });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la encuesta', details: error.message });
  }
});

// Obtener todas las encuestas
router.get('/encuestas', async (req, res) => {
  try {
    const encuestas = await prisma.encuestas.findMany();
    // Convertir id de BigInt a String
    const modifiedEncuestas = encuestas.map(encuesta => ({
      ...encuesta,
      id: encuesta.id.toString(),
    }));
    res.json(modifiedEncuestas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las encuestas', details: error.message });
  }
});

// Obtener una encuesta por ID
router.get('/encuestas/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const encuesta = await prisma.encuestas.findUnique({
      where: { id },
    });
    if (!encuesta) return res.status(404).json({ error: 'Encuesta no encontrada' });
    res.json({ ...encuesta, id: encuesta.id.toString() });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la encuesta', details: error.message });
  }
});

// Actualizar una encuesta
router.put('/encuestas/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { pregunta, bueno, malo, regular } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const encuestaActualizada = await prisma.encuestas.update({
      where: { id },
      data: { pregunta, bueno, malo, regular },
    });
    res.json({ ...encuestaActualizada, id: encuestaActualizada.id.toString() });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Encuesta no encontrada' });
    }
    res.status(500).json({ error: 'Error al actualizar la encuesta', details: error.message });
  }
});

// Eliminar una encuesta
router.delete('/encuestas/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    await prisma.encuestas.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Encuesta no encontrada' });
    }
    res.status(500).json({ error: 'Error al eliminar la encuesta', details: error.message });
  }
});

module.exports = router;
