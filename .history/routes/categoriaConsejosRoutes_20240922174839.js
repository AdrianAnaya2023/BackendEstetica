// routes/categoriaConsejosRoutes.js
const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Crear una nueva categoría de consejos
router.post('/categorias-consejos', async (req, res) => {
  const { nombre, descripcion, imagen } = req.body;
  try {
    const nuevaCategoria = await prisma.categoriaConsejos.create({
      data: { nombre, descripcion, imagen },
    });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la categoría de consejos' });
  }
});

// Obtener todas las categorías de consejos
router.get('/categorias-consejos', async (req, res) => {
  try {
    const categorias = await prisma.categoriaConsejos.findMany();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías de consejos' });
  }
});

// Obtener una categoría de consejos por ID
router.get('/categorias-consejos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await prisma.categoriaConsejos.findUnique({
      where: { id: parseInt(id) },
    });
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la categoría' });
  }
});

// Actualizar una categoría de consejos
router.put('/categorias-consejos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, imagen } = req.body;
  try {
    const categoriaActualizada = await prisma.categoriaConsejos.update({
      where: { id: parseInt(id) },
      data: { nombre, descripcion, imagen },
    });
    res.json(categoriaActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
});

// Eliminar una categoría de consejos
router.delete('/categorias-consejos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.categoriaConsejos.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
});

module.exports = router;
