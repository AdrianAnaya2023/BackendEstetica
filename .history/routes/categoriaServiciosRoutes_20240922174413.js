// routes/categoriaServiciosRoutes.js
const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Crear una nueva categoría de servicios
router.post('/categorias-servicios', async (req, res) => {
  const { nombre, descripcion, imagen } = req.body;
  try {
    const nuevaCategoria = await prisma.categoriaServicios.create({
      data: { nombre, descripcion, imagen },
    });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la categoría de servicios' });
  }
});

// Obtener todas las categorías de servicios
router.get('/categorias-servicios', async (req, res) => {
  try {
    const categorias = await prisma.categoriaServicios.findMany();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías de servicios' });
  }
});

// Obtener una categoría de servicios por ID
router.get('/categorias-servicios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await prisma.categoriaServicios.findUnique({
      where: { id: parseInt(id) },
    });
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la categoría' });
  }
});

// Actualizar una categoría de servicios
router.put('/categorias-servicios/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, imagen } = req.body;
  try {
    const categoriaActualizada = await prisma.categoriaServicios.update({
      where: { id: parseInt(id) },
      data: { nombre, descripcion, imagen },
    });
    res.json(categoriaActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
});

// Eliminar una categoría de servicios
router.delete('/categorias-servicios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.categoriaServicios.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
});

module.exports = router;
