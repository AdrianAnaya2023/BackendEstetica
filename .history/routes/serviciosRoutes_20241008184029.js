const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Middleware para validar los datos del servicio
function validateServiceData(req, res, next) {
  const { titulo, descripcion, imagen, categoria_id } = req.body;
  if (!titulo || !descripcion || !imagen || !categoria_id) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  next();
}

// Crear un nuevo servicio
// Crear un nuevo servicio
router.post('/servicios', async (req, res) => {
  const { titulo, descripcion, imagen, categoria_id } = req.body;
  try {
    const nuevoServicio = await prisma.servicio.create({
      data: {
        titulo,
        descripcion,
        imagen,
        categoria_id: BigInt(categoria_id), // Asegúrate de que esto sea un BigInt
      },
    });

    // Convertir BigInt a String para la respuesta
    res.status(201).json({
      ...nuevoServicio,
      id: nuevoServicio.id.toString(),
      categoria_id: nuevoServicio.categoria_id.toString(), // Si necesitas enviar categoria_id también
    });
  } catch (error) {
    console.error('Error al crear el servicio:', error);
    res.status(500).json({ error: 'Error al crear el servicio', details: error.message });
  }
});


// Obtener todos los servicios
router.get('/servicios', async (req, res) => {
  try {
    const servicios = await prisma.servicio.findMany();
    // Convertir BigInt a String
    const modifiedServicios = servicios.map(servicio => ({
      ...servicio,
      id: servicio.id.toString(), // Asegúrate de convertir todos los BigInt
      categoria_id: servicio.categoria_id.toString() // Si es necesario
    }));
    res.json(modifiedServicios);
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
    const servicio = await prisma.servicios.findUnique({
      where: { id: BigInt(id) },
      include: { categoria: true },
    });
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    // Convertir BigInt a string
    res.json({
      ...servicio,
      id: servicio.id.toString(),
      categoria_id: servicio.categoria_id.toString(),
      categoria: servicio.categoria
        ? { ...servicio.categoria, id: servicio.categoria.id.toString() }
        : null,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el servicio', details: error.message });
  }
});

// Actualizar un servicio
router.put('/:id', validateServiceData, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const { titulo, descripcion, imagen, categoria_id } = req.body;

  try {
    const servicioActualizado = await prisma.servicios.update({
      where: { id: BigInt(id) },
      data: {
        titulo,
        descripcion,
        imagen,
        categoria: {
          connect: { id: BigInt(categoria_id) },
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
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    await prisma.servicios.delete({
      where: { id: BigInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.status(500).json({ error: 'Error al eliminar el servicio', details: error.message });
  }
});

// Obtener servicios por categoría
router.get('/categoria/:categoriaId', async (req, res) => {
  const categoriaId = parseInt(req.params.categoriaId);
  if (isNaN(categoriaId)) {
    return res.status(400).json({ error: 'ID de categoría inválido' });
  }

  try {
    const servicios = await prisma.servicios.findMany({
      where: { categoria_id: BigInt(categoriaId) },
      include: { categoria: true },
    });
    // Convertir BigInt a string
    const modifiedServicios = servicios.map((servicio) => ({
      ...servicio,
      id: servicio.id.toString(),
      categoria_id: servicio.categoria_id.toString(),
      categoria: servicio.categoria
        ? { ...servicio.categoria, id: servicio.categoria.id.toString() }
        : null,
    }));
    res.json(modifiedServicios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los servicios por categoría', details: error.message });
  }
});

module.exports = router;