// routes/serviciosRoutes.js
const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Crear un nuevo servicio
router.post('/servicios', async (req, res) => {
  const { titulo, descripcion, imagen, categoriaId } = req.body;
  try {
    const nuevoServicio = await prisma.servicios.create({
      data: { titulo, descripcion, imagen, categoriaId },
    });
    res.status(201).json(nuevoServicio);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el servicio' });
  }
});

// Obtener todos los servicios
router.get('/servicios', async (req, res) => {
  try {
    const servicios = await prisma.servicios.findMany({ include: { categoria: true } });
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los servicios' });
  }
});

// Obtener un servicio por ID
router.get('/servicios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const servicio = await prisma.servicios.findUnique({
      where: { id: parseInt(id) },
      include: { categoria: true },
    });
    if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el servicio' });
  }
});

// Actualizar un servicio
router.put('/servicios/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, imagen, categoriaId } = req.body;
  try {
    const servicioActualizado = await prisma.servicios.update({
      where: { id: parseInt(id) },
      data: { titulo, descripcion, imagen, categoriaId },
    });
    res.json(servicioActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el servicio' });
  }
});

// Eliminar un servicio
router.delete('/servicios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.servicios.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el servicio' });
  }
});

module.exports = router;
