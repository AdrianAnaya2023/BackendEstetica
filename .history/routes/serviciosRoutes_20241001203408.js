const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Middleware para validar los datos de un servicio
function validateServiceData(req, res, next) {
  const { titulo, descripcion, imagen, categoria_id } = req.body;
  if (!titulo || !descripcion || !imagen || !categoria_id) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  next();
}

// Crear un nuevo servicio
router.post('/', validateServiceData, async (req, res) => {
  try {
    const { titulo, descripcion, imagen, categoria_id } = req.body;
    const nuevoServicio = await prisma.servicios.create({
      data: {
        titulo,
        descripcion,
        imagen,
        categoria: {
          connect: { id: BigInt(categoria_id) }, // Manejo de BigInt para categoria_id
        },
      },
    });
    // Convertir BigInt a string para mantener consistencia
    res.status(201).json({ 
      ...nuevoServicio, 
      id: nuevoServicio.id.toString(), 
      categoria_id: nuevoServicio.categoria_id.toString(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el servicio', details: error.message });
  }
});

// Obtener todos los servicios
router.get('/', async (req, res) => {
  try {
    const servicios = await prisma.servicios.findMany({ include: { categoria: true } });
    // Convertir BigInt a string
    const modifiedServicios = servicios.map(servicio => ({
      ...servicio,
      id: servicio.id.toString(),
      categoria_id: servicio.categoria_id.toString(),
      categoria: servicio.categoria ? { ...servicio.categoria, id: servicio.categoria.id.toString() } : null,
    }));
    res.json(modifiedServicios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los servicios', details: error.message });
  }
});

// Obtener un servicio por ID
router.get('/:id', async (req, res) => {
  const id = BigInt(req.params.id); // Usamos BigInt para el id
  try {
    const servicio = await prisma.servicios.findUnique({
      where: { id },
      include: { categoria: true },
    });
    if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });
    // Convertir BigInt a string
    res.json({
      ...servicio,
      id: servicio.id.toString(),
      categoria_id: servicio.categoria_id.toString(),
      categoria: servicio.categoria ? { ...servicio.categoria, id: servicio.categoria.id.toString() } : null,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el servicio', details: error.message });
  }
});

// Actualizar un servicio
router.put('/:id', validateServiceData, async (req, res) => {
  const id = BigInt(req.params.id); // Usamos BigInt para el id
  const { titulo, descripcion, imagen, categoria_id } = req.body;
  try {
    const servicioActualizado = await prisma.servicios.update({
      where: { id },
      data: {
        titulo,
        descripcion,
        imagen,
        categoria: {
          connect: { id: BigInt(categoria_id) }, // Manejo de BigInt para categoria_id
        },
      },
    });
    // Convertir BigInt a string
    res.json({ 
      ...servicioActualizado, 
      id: servicioActualizado.id.toString(),
      categoria_id: servicioActualizado.categoria_id.toString(),
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.status(500).json({ error: 'Error al actualizar el servicio', details: error.message });
  }
});

// Eliminar un servicio
router.delete('/:id', async (req, res) => {
  const id = BigInt(req.params.id); // Usamos BigInt para el id

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
