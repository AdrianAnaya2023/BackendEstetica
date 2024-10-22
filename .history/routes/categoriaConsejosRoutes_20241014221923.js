const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Crear una nueva categoría de consejos
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, imagen } = req.body;
    const nuevaCategoria = await prisma.categoriaConsejos.create({
      data: { nombre, descripcion, imagen },
    });
    // Convertir id de BigInt a String si es necesario
    res.status(201).json({ ...nuevaCategoria, id: nuevaCategoria.id.toString() });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la categoría de consejos', details: error.message });
  }
});

// Obtener todas las categorías de consejos
router.get('/', async (req, res) => {
  try {
    const categorias = await prisma.categoriaConsejos.findMany();
    // Convertir id de BigInt a String
    const modifiedCategorias = categorias.map(categoria => ({
      ...categoria,
      id: categoria.id.toString(),
    }));
    res.json(modifiedCategorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías de consejos', details: error.message });
  }
});

// Obtener una categoría de consejos por ID
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const categoria = await prisma.categoriaConsejos.findUnique({
      where: { id },
    });
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json({ ...categoria, id: categoria.id.toString() });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la categoría', details: error.message });
  }
});

// Actualizar una categoría de consejos
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, descripcion, imagen } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const categoriaActualizada = await prisma.categoriaConsejos.update({
      where: { id },
      data: { nombre, descripcion, imagen },
    });
    res.json({ ...categoriaActualizada, id: categoriaActualizada.id.toString() });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.status(500).json({ error: 'Error al actualizar la categoría', details: error.message });
  }
});

// Eliminar una categoría de consejos
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    await prisma.categoriaConsejos.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.status(500).json({ error: 'Error al eliminar la categoría', details: error.message });
  }
});

module.exports = router;
