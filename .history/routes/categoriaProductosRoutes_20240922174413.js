// routes/categoriaProductosRoutes.js
const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Crear una nueva categoría de productos
router.post('/categorias-productos', async (req, res) => {
  try {
    const { nombre, descripcion, imagen } = req.body;
    const nuevaCategoria = await prisma.categoriaProductos.create({
      data: {
        nombre,
        descripcion,
        imagen,
      },
    });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la categoría de productos' });
  }
});

// Obtener todas las categorías de productos
router.get('/categorias-productos', async (req, res) => {
  try {
    const categorias = await prisma.categoriaProductos.findMany();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías de productos' });
  }
});

// Obtener una categoría por ID
router.get('/categorias-productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await prisma.categoriaProductos.findUnique({
      where: { id: parseInt(id) },
    });
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la categoría' });
  }
});

// Actualizar una categoría de productos
router.put('/categorias-productos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, imagen } = req.body;
  try {
    const categoriaActualizada = await prisma.categoriaProductos.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        descripcion,
        imagen,
      },
    });
    res.json(categoriaActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
});

// Eliminar una categoría de productos
router.delete('/categorias-productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.categoriaProductos.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
});

module.exports = router;
