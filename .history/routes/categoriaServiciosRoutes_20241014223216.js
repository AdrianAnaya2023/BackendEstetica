const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Middleware para validar los datos de la categoría de servicios
function validateCategoriaData(req, res, next) {
  const { nombre, descripcion, imagen } = req.body;
  if (!nombre || !descripcion || !imagen) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  next();
}

// Obtener todas las categorías de servicios
router.get('/', async (req, res) => {
  try {
    const categorias = await prisma.categoriaServicio.findMany();
    // Convertir los IDs de BigInt a string si es necesario
    const modifiedCategorias = categorias.map((categoria) => ({
      ...categoria,
      id: categoria.id.toString(),
    }));
    res.json(modifiedCategorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las categorías de servicios', details: error.message });
  }
});

// Obtener una categoría de servicios por ID
router.get('/:id', async (req, res) => {
  const id = BigInt(req.params.id); // Convertir el ID a BigInt
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const categoria = await prisma.categoriaServicio.findUnique({
      where: { id: id },
    });
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría de servicio no encontrada' });
    }
    // Convertir BigInt a string en la respuesta
    res.json({ ...categoria, id: categoria.id.toString() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la categoría de servicio', details: error.message });
  }
});

// Crear una nueva categoría de servicios
router.post('/', validateCategoriaData, async (req, res) => {
  const { nombre, descripcion, imagen } = req.body;

  try {
    const nuevaCategoria = await prisma.categoriaServicio.create({
      data: { nombre, descripcion, imagen },
    });
    // Convertir BigInt a string en la respuesta
    res.status(201).json({ ...nuevaCategoria, id: nuevaCategoria.id.toString() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la categoría de servicio', details: error.message });
  }
});

// Actualizar una categoría de servicios
router.put('/:id', validateCategoriaData, async (req, res) => {
  const id = BigInt(req.params.id); // Convertir el ID a BigInt
  const { nombre, descripcion, imagen } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const categoriaActualizada = await prisma.categoriaServicio.update({
      where: { id: id },
      data: { nombre, descripcion, imagen },
    });
    // Convertir BigInt a string en la respuesta
    res.json({ ...categoriaActualizada, id: categoriaActualizada.id.toString() });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Categoría de servicio no encontrada' });
    }
    res.status(500).json({ error: 'Error al actualizar la categoría de servicio', details: error.message });
  }
});

// Eliminar una categoría de servicios
router.delete('/:id', async (req, res) => {
  const id = BigInt(req.params.id); // Convertir el ID a BigInt
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    await prisma.categoriaServicio.delete({
      where: { id: id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Categoría de servicio no encontrada' });
    }
    res.status(500).json({ error: 'Error al eliminar la categoría de servicio', details: error.message });
  }
});

module.exports = router;
