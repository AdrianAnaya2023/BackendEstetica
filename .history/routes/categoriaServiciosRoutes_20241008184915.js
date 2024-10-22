const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Crear una nueva categoría de servicios
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, imagen } = req.body;
    const nuevaCategoria = await prisma.categoriaServicios.create({
      data: { nombre, descripcion, imagen },
    });
    // Convertir id de BigInt a String
    res.status(201).json({ 
      ...nuevaCategoria, 
      id: nuevaCategoria.id.toString() 
    });
  } catch (error) {
    console.error('Error al crear la categoría de servicios:', error);
    res.status(500).json({ error: 'Error al crear la categoría de servicios', details: error.message });
  }
});

// Obtener todas las categorías de servicios
router.get('/', async (req, res) => {
  try {
    const categorias = await prisma.categoriaServicios.findMany();
    // Convertir id de BigInt a String
    const modifiedCategorias = categorias.map(categoria => ({
      ...categoria,
      id: categoria.id.toString(),
    }));
    res.json(modifiedCategorias);
  } catch (error) {
    console.error('Error al obtener las categorías de servicios:', error);
    res.status(500).json({ error: 'Error al obtener las categorías de servicios', details: error.message });
  }
});

// Obtener una categoría de servicios por ID
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const categoria = await prisma.categoriaServicios.findUnique({
      where: { id },
    });
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    // Convertir id de BigInt a String
    res.json({ ...categoria, id: categoria.id.toString() });
  } catch (error) {
    console.error('Error al obtener la categoría:', error);
    res.status(500).json({ error: 'Error al obtener la categoría', details: error.message });
  }
});

// Actualizar una categoría de servicios
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, descripcion, imagen } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const categoriaActualizada = await prisma.categoriaServicios.update({
      where: { id },
      data: { nombre, descripcion, imagen },
    });
    // Convertir id de BigInt a String
    res.json({ ...categoriaActualizada, id: categoriaActualizada.id.toString() });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    console.error('Error al actualizar la categoría:', error);
    res.status(500).json({ error: 'Error al actualizar la categoría', details: error.message });
  }
});

// Eliminar una categoría de servicios
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    await prisma.categoriaServicios.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    console.error('Error al eliminar la categoría:', error);
    res.status(500).json({ error: 'Error al eliminar la categoría', details: error.message });
  }
});

module.exports = router;
