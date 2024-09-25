// routes/galeriaRoutes.js
const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Crear una nueva entrada de galería
router.post('/galeria', async (req, res) => {
  const { foto_antes, foto_despues, categoriaId } = req.body;
  try {
    const nuevaGaleria = await prisma.galeria.create({
      data: { foto_antes, foto_despues, categoriaId },
    });
    res.status(201).json(nuevaGaleria);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la galería' });
  }
});

// Obtener todas las entradas de la galería
router.get('/galeria', async (req, res) => {
  try {
    const galerias = await prisma.galeria.findMany({ include: { categoria: true } });
    res.json(galerias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las galerías' });
  }
});

// Obtener una entrada de la galería por ID
router.get('/galeria/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const galeria = await prisma.galeria.findUnique({
      where: { id: parseInt(id) },
      include: { categoria: true },
    });
    if (!galeria) return res.status(404).json({ error: 'Galería no encontrada' });
    res.json(galeria);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la galería' });
  }
});

// Actualizar una entrada de la galería
router.put('/galeria/:id', async (req, res) => {
  const { id } = req.params;
  const { foto_antes, foto_despues, categoriaId } = req.body;
  try {
    const galeriaActualizada = await prisma.galeria.update({
      where: { id: parseInt(id) },
      data: { foto_antes, foto_despues, categoriaId },
    });
    res.json(galeriaActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la galería' });
  }
});

// Eliminar una entrada de la galería
router.delete('/galeria/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.galeria.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la galería' });
  }
});

module.exports = router;
