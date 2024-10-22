const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Middleware para validar los datos de la categoría de consejos
function validateCategoriaConsejosData(req, res, next) {
  const { nombre, descripcion, imagen } = req.body;
  if (!nombre || !descripcion || !imagen) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  next();
}

// Crear una nueva categoría de consejos
router.post('/', validateCategoriaConsejosData, async (req, res) => {
  try {
    const { nombre, descripcion, imagen } = req.body;
    const nuevaCategoria = await prisma.categoriaConsejos.create({
      data: { nombre, descripcion, imagen },
    });
    // Convertir id de BigInt a String si es necesario
    res.status(201).json({ ...nuevaCategoria, id: nuevaCategoria.id.toString() });
  } catch (error) {
    console.error(error);
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
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las categorías de consejos', details: error.message });
  }
});

// Obtener una categoría de consejos por ID
router.get('/:id', async (req, res) => {
  const id = BigInt(req.params.id); // Convertir el ID a BigInt
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const categoria = await prisma.categoriaConsejos.findUnique({
      where: { id },
    });
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    // Convertir id de BigInt a String en la respuesta
    res.json({ ...categoria, id: categoria.id.toString() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la categoría', details: error.message });
  }
});

// Actualizar una categoría de consejos
router.put('/:id', validateCategoriaConsejosData, async (req, res) => {
  const id = BigInt(req.params.id); // Convertir el ID a BigInt
  const { nombre, descripcion, imagen } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const categoriaActualizada = await prisma.categoriaConsejos.update({
      where: { id },
      data: { nombre, descripcion, imagen },
    });
    // Convertir id de BigInt a String en la respuesta
    res.json({ ...categoriaActualizada, id: categoriaActualizada.id.toString() });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.status(500).json({ error: 'Error al actualizar la categoría', details: error.message });
  }
});

// Eliminar una categoría de consejos
router.delete('/:id', async (req, res) => {
  const id = BigInt(req.params.id); // Convertir el ID a BigInt

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    await prisma.categoriaConsejos.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.status(500).json({ error: 'Error al eliminar la categoría', details: error.message });
  }
});

module.exports = router;
