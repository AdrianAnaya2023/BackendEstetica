const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Función para validar y convertir ID a BigInt
function validateBigIntId(id, res) {
  try {
    return BigInt(id);
  } catch (error) {
    res.status(400).json({ error: 'ID inválido, debe ser un número válido' });
    return null;
  }
}

// Middleware para validar los datos de una categoría de servicios
function validateCategoriaServiciosData(req, res, next) {
  const { nombre, descripcion, imagen } = req.body;
  if (!nombre || !descripcion || !imagen) {
    return res.status(400).json({ error: 'Todos los campos son requeridos: nombre, descripcion, imagen' });
  }
  next();
}

// Crear una nueva categoría de servicios
router.post('/categorias-servicios', validateCategoriaServiciosData, async (req, res) => {
  try {
    const { nombre, descripcion, imagen } = req.body;
    const nuevaCategoria = await prisma.categoriaServicios.create({
      data: { nombre, descripcion, imagen },
    });
    // Convertir id de BigInt a String si es necesario
    res.status(201).json({ ...nuevaCategoria, id: nuevaCategoria.id.toString() });
  } catch (error) {
    console.error('Error al crear la categoría de servicios:', error);
    res.status(500).json({ error: 'Error al crear la categoría de servicios', details: error.message });
  }
});

// Obtener todas las categorías de servicios
router.get('/categorias-servicios', async (req, res) => {
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
router.get('/categorias-servicios/:id', async (req, res) => {
  const id = validateBigIntId(req.params.id, res);
  if (!id) return; // Si la validación falló, detener la ejecución

  try {
    const categoria = await prisma.categoriaServicios.findUnique({
      where: { id },
    });
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json({ ...categoria, id: categoria.id.toString() });
  } catch (error) {
    console.error('Error al obtener la categoría de servicios:', error);
    res.status(500).json({ error: 'Error al obtener la categoría de servicios', details: error.message });
  }
});

// Actualizar una categoría de servicios
router.put('/categorias-servicios/:id', validateCategoriaServiciosData, async (req, res) => {
  const id = validateBigIntId(req.params.id, res);
  if (!id) return; // Si la validación falló, detener la ejecución

  const { nombre, descripcion, imagen } = req.body;

  try {
    const categoriaActualizada = await prisma.categoriaServicios.update({
      where: { id },
      data: { nombre, descripcion, imagen },
    });
    res.json({ ...categoriaActualizada, id: categoriaActualizada.id.toString() });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    console.error('Error al actualizar la categoría de servicios:', error);
    res.status(500).json({ error: 'Error al actualizar la categoría de servicios', details: error.message });
  }
});

// Eliminar una categoría de servicios
router.delete('/categorias-servicios/:id', async (req, res) => {
  const id = validateBigIntId(req.params.id, res);
  if (!id) return; // Si la validación falló, detener la ejecución

  try {
    await prisma.categoriaServicios.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    console.error('Error al eliminar la categoría de servicios:', error);
    res.status(500).json({ error: 'Error al eliminar la categoría de servicios', details: error.message });
  }
});

module.exports = router;
