const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Crear un nuevo servicio
router.post('/servicios', async (req, res) => {
  const { titulo, descripcion, imagen, categoria_id } = req.body;
  try {
    const nuevoServicio = await prisma.servicios.create({
      data: {
        titulo,
        descripcion,
        imagen,
        categoria: {
          connect: { id: categoria_id },
        },
      },
    });
    // Convertir id de BigInt a String si es necesario
    res.status(201).json({ ...nuevoServicio, id: nuevoServicio.id.toString() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el servicio', details: error.message });
  }
});

// Obtener todos los servicios
router.get('/servicios', async (req, res) => {
  try {
    const servicios = await prisma.servicios.findMany({ include: { categoria: true } });
    // Convertir id de BigInt a String
    const modifiedServicios = servicios.map(servicio => ({
      ...servicio,
      id: servicio.id.toString(),
      categoria: servicio.categoria ? { ...servicio.categoria, id: servicio.categoria.id.toString() } : null,
    }));
    res.json(modifiedServicios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los servicios', details: error.message });
  }
});

// Obtener un servicio por ID
router.get('/servicios/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const servicio = await prisma.servicios.findUnique({
      where: { id },
      include: { categoria: true },
    });
    if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });
    res.json({ ...servicio, id: servicio.id.toString(), categoria: servicio.categoria ? { ...servicio.categoria, id: servicio.categoria.id.toString() } : null });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el servicio', details: error.message });
  }
});

// Actualizar un servicio
router.put('/servicios/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, descripcion, imagen, categoria_id } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const servicioActualizado = await prisma.servicios.update({
      where: { id },
      data: {
        titulo,
        descripcion,
        imagen,
        categoria: {
          connect: { id: categoria_id },
        },
      },
    });
    res.json({ ...servicioActualizado, id: servicioActualizado.id.toString() });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.status(500).json({ error: 'Error al actualizar el servicio', details: error.message });
  }
});

// Eliminar un servicio
router.delete('/servicios/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    await prisma.servicios.delete({
      where: { id },
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
