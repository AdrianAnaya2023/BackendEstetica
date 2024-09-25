const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Crear una nueva entrada de galería
router.post('/galeria', async (req, res) => {
  const { foto_antes, foto_despues, categoria_id } = req.body;
  try {
    const nuevaGaleria = await prisma.galeria.create({
      data: {
        foto_antes,
        foto_despues,
        categoria: {
          connect: { id: categoria_id },
        },
      },
    });
    // Convertir id de BigInt a String si es necesario
    res.status(201).json({ ...nuevaGaleria, id: nuevaGaleria.id.toString() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la galería', details: error.message });
  }
});

// Obtener todas las entradas de la galería
router.get('/galeria', async (req, res) => {
  try {
    const galerias = await prisma.galeria.findMany({ include: { categoria: true } });
    // Convertir id de BigInt a String
    const modifiedGalerias = galerias.map(galeria => ({
      ...galeria,
      id: galeria.id.toString(),
      categoria: galeria.categoria ? { ...galeria.categoria, id: galeria.categoria.id.toString() } : null,
    }));
    res.json(modifiedGalerias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las galerías', details: error.message });
  }
});

// Obtener una entrada de la galería por ID
router.get('/galeria/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const galeria = await prisma.galeria.findUnique({
      where: { id },
      include: { categoria: true },
    });
    if (!galeria) return res.status(404).json({ error: 'Galería no encontrada' });
    res.json({ ...galeria, id: galeria.id.toString(), categoria: galeria.categoria ? { ...galeria.categoria, id: galeria.categoria.id.toString() } : null });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la galería', details: error.message });
  }
});

// Actualizar una entrada de la galería
router.put('/galeria/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { foto_antes, foto_despues, categoria_id } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const galeriaActualizada = await prisma.galeria.update({
      where: { id },
      data: {
        foto_antes,
        foto_despues,
        categoria: {
          connect: { id: categoria_id },
        },
      },
    });
    res.json({ ...galeriaActualizada, id: galeriaActualizada.id.toString() });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Galería no encontrada' });
    }
    res.status(500).json({ error: 'Error al actualizar la galería', details: error.message });
  }
});

// Eliminar una entrada de la galería
router.delete('/galeria/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    await prisma.galeria.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Galería no encontrada' });
    }
    res.status(500).json({ error: 'Error al eliminar la galería', details: error.message });
  }
});

module.exports = router;
