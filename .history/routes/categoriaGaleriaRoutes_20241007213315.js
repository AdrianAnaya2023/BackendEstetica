const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Middleware para validar los datos de la categoría de galería
function validateCategoriaGaleriaData(req, res, next) {
  const { nombre, descripcion, imagen } = req.body;
  if (!nombre || !descripcion || !imagen) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  next();
}

// Helper para validar y convertir ID a BigInt
function validateBigIntId(id, res) {
  try {
    return BigInt(id);
  } catch (error) {
    res.status(400).json({ error: 'ID inválido, debe ser un número válido' });
    return null;
  }
}

router.post('/categorias-galeria', async (req, res) => {
  try {
    const { nombre, descripcion, imagen } = req.body;
    const nuevaCategoria = await prisma.categoriaGaleria.create({
      data: { nombre, descripcion, imagen },
    });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    console.error('Error al crear la categoría de galería:', error);
    res.status(500).json({ error: 'Error al crear la categoría de galería' });
  }
});

// Obtener todas las categorías de galería
router.get('/categorias-galeria', async (req, res) => {
  try {
    const categorias = await prisma.categoriaGaleria.findMany();
    const modifiedCategorias = categorias.map(categoria => ({
      ...categoria,
      id: categoria.id.toString(),
    }));
    res.json(modifiedCategorias);
  } catch (error) {
    console.error('Error al obtener las categorías de galería:', error);
    res.status(500).json({ error: 'Error al obtener las categorías de galería', details: error.message });
  }
});

// Obtener una categoría de galería por ID
router.get('/categorias-galeria/:id', async (req, res) => {
  const id = validateBigIntId(req.params.id, res);
  if (!id) return; // Salir si el ID es inválido
  
  try {
    const categoria = await prisma.categoriaGaleria.findUnique({
      where: { id },
    });
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json({ ...categoria, id: categoria.id.toString() });
  } catch (error) {
    console.error('Error al obtener la categoría de galería:', error);
    res.status(500).json({ error: 'Error al obtener la categoría', details: error.message });
  }
});

// Actualizar una categoría de galería
router.put('/categorias-galeria/:id', async (req, res) => {
  const id = BigInt(req.params.id);
  const { nombre, descripcion, imagen } = req.body;
  try {
    const categoriaActualizada = await prisma.categoriaGaleria.update({
      where: { id },
      data: { nombre, descripcion, imagen },
    });
    res.json(categoriaActualizada);
  } catch (error) {
    console.error('Error al actualizar la categoría de galería:', error);
    res.status(500).json({ error: 'Error al actualizar la categoría de galería' });
  }
});

// Eliminar una categoría de galería
router.delete('/categorias-galeria/:id', async (req, res) => {
  const id = validateBigIntId(req.params.id, res);
  if (!id) return; // Salir si el ID es inválido

  try {
    await prisma.categoriaGaleria.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    console.error('Error al eliminar la categoría de galería:', error);
    res.status(500).json({ error: 'Error al eliminar la categoría', details: error.message });
  }
});

module.exports = router;
