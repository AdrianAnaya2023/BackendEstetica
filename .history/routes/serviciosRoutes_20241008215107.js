const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Obtener todos los servicios
router.get('/', async (req, res) => {
  try {
    const servicios = await prisma.servicio.findMany({
      include: { categoria: true },
    });
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los servicios', details: error.message });
  }
});

// Obtener un servicio por ID
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const servicio = await prisma.servicio.findUnique({
      where: { id: id },
      include: { categoria: true },
    });
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el servicio', details: error.message });
  }
});

// Crear un nuevo servicio
router.post('/', async (req, res) => {
  const { titulo, descripcion, imagen, categoria_id } = req.body;
  if (!titulo || !categoria_id) {
    return res.status(400).json({ error: 'El título y la categoría son requeridos' });
  }
  try {
    const nuevoServicio = await prisma.servicio.create({
      data: {
        titulo,
        descripcion,
        imagen,
        categoria_id
      }
    });
    res.status(201).json(nuevoServicio);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el servicio', details: error.message });
  }
});

// Actualizar un servicio
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, descripcion, imagen, categoria_id } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const servicioActualizado = await prisma.servicio.update({
      where: { id: id },
      data: {
        titulo,
        descripcion,
        imagen,
        categoria_id
      }
    });
    res.json(servicioActualizado);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.status(500).json({ error: 'Error al actualizar el servicio', details: error.message });
  }
});

// Eliminar un servicio
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    await prisma.servicio.delete({
      where: { id: id }
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.status(500).json({ error: 'Error al eliminar el servicio', details: error.message });
  }
});

module.exports = router;
