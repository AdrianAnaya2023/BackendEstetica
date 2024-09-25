// routes/promosRoutes.js
const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Crear una nueva promo
router.post('/promos', async (req, res) => {
  const { foto, titulo, descripcion, fecha_fin } = req.body;
  try {
    const nuevaPromo = await prisma.promos.create({
      data: { foto, titulo, descripcion, fecha_fin: new Date(fecha_fin) },
    });
    res.status(201).json(nuevaPromo);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la promo' });
  }
});

// Obtener todas las promos
router.get('/promos', async (req, res) => {
  try {
    const promos = await prisma.promos.findMany();
    res.json(promos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las promos' });
  }
});

// Obtener una promo por ID
router.get('/promos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const promo = await prisma.promos.findUnique({
      where: { id: parseInt(id) },
    });
    if (!promo) return res.status(404).json({ error: 'Promo no encontrada' });
    res.json(promo);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la promo' });
  }
});

// Actualizar una promo
router.put('/promos/:id', async (req, res) => {
  const { id } = req.params;
  const { foto, titulo, descripcion, fecha_fin } = req.body;
  try {
    const promoActualizada = await prisma.promos.update({
      where: { id: parseInt(id) },
      data: { foto, titulo, descripcion, fecha_fin: new Date(fecha_fin) },
    });
    res.json(promoActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la promo' });
  }
});

// Eliminar una promo
router.delete('/promos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.promos.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la promo' });
  }
});

module.exports = router;
