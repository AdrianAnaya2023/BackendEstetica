// routes/categoriaGaleriaRoutes.js
const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Crear una nueva categoría de galería
router.post('/categorias-galeria', async (req, res) => {
  const { nombre, descripcion, imagen } = req.body;
  try {
    const nuevaCategoria = await prisma.categoriaGaleria.create({
      data: { nombre, descripcion, imagen },
    });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la categoría de galería' });
  }
});

// Obtener todas las categorías de galería
router.get('/categorias-galeria', async (req, res) => {
  try {
    const categorias = await prisma.categoriaGaleria.findMany();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías de galería' });
  }
});

// Obtener una categoría de galería por ID
router.get('/categorias-galeria/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await prisma.categoriaGaleria.findUnique({
      where: { id: parseInt(id) },
    });
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la categoría' });
  }
});

// Actualizar una categoría de galería
router.put('/categorias-galeria/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, imagen } = req.body;
  try {
    const categoriaActualizada = await prisma.categoriaGaleria.update({
      where: { id: parseInt(id) },
      data: { nombre, descripcion, imagen },
    });
    res.json(categoriaActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
});

// Eliminar una categoría de galería
router.delete('/categorias-galeria/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.categoriaGaleria.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
});

module.exports = router;
