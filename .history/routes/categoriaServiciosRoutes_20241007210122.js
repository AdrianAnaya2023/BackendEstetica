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
function validateCategoriaServicioData(req, res, next) {
  const { nombre, descripcion, imagen } = req.body;
  if (!nombre || !descripcion || !imagen) {
    return res.status(400).json({ error: 'Todos los campos (nombre, descripcion, imagen) son requeridos.' });
  }
  next();
}

// Crear una nueva categoría de servicios
router.post('/categorias-servicios', validateCategoriaServicioData, async (req, res) => {
  try {
    const { nombre, descripcion, imagen } = req.body;
    const nuevaCategoria = await prisma.categoriaServicios.create({
      data: { nombre, descripcion, imagen },
    });

    // Convertir BigInt a string si aplica
    res.status(201).json({ ...nuevaCategoria, id: nuevaCategoria.id.toString() });
  } catch (error) {
    console.error('Error al crear la categoría de servicios:', error);
    res.status(500).json({ error: 'Error al crear la categoría de servicios', details: error.message });
  }
});

//Obtener categorias
router.get('/categorias-servicios', async (req, res) => {
  try {
    const categorias = await prisma.categoriaServicios.findMany();
    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener las categorías de servicios:', error);
    res.status(500).json({ error: 'Error al obtener las categorías de servicios' });
  }
});

// Obtener una categoría de servicios por ID
router.get('/categorias-servicios/:id', async (req, res) => {
  const id = validateBigIntId(req.params.id, res);
  if (!id) return;

  try {
    const categoria = await prisma.categoriaServicios.findUnique({
      where: { id },
    });
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json({ ...categoria, id: categoria.id.toString() });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la categoría', details: error.message });
  }
});

// Actualizar una categoría de servicios
router.put('/categorias-servicios/:id', async (req, res) => {
  const id = validateBigIntId(req.params.id, res);
  if (!id) return; // Si la validación falla, se detiene el proceso

  const { nombre, descripcion, imagen } = req.body;

  // Validar que todos los campos requeridos estén presentes
  if (!nombre || !descripcion || !imagen) {
    return res.status(400).json({ error: 'Todos los campos (nombre, descripcion, imagen) son requeridos.' });
  }

  try {
    const categoriaActualizada = await prisma.categoriaServicios.update({
      where: { id },
      data: { nombre, descripcion, imagen },
    });

    res.status(200).json({
      ...categoriaActualizada,
      id: categoriaActualizada.id.toString(), // Convertir BigInt a string
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    console.error('Error al actualizar la categoría:', error);
    res.status(500).json({ error: 'Error al actualizar la categoría', details: error.message });
  }
});


// Eliminar una categoría de servicios
router.delete('/categorias-servicios/:id', async (req, res) => {
  const id = validateBigIntId(req.params.id, res);
  if (!id) return;

  try {
    await prisma.categoriaServicios.delete({
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
