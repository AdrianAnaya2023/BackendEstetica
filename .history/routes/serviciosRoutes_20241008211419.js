const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Función para convertir BigInt a string de manera segura
function bigIntToString(value) {
  return value ? value.toString() : null;
}

// Middleware para validar los datos del servicio
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
          connect: { id: BigInt(categoria_id) },
        },
      },
    });
    res.status(201).json({
      ...nuevoServicio,
      id: bigIntToString(nuevoServicio.id),
      categoria_id: bigIntToString(nuevoServicio.categoria_id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el servicio', details: error.message });
  }
});

// Obtener todos los servicios
router.get('/', async (req, res) => {
  try {
    const servicios = await prisma.servicios.findMany({
      include: { categoria: true },
    });
    const modifiedServicios = servicios.map((servicio) => ({
      ...servicio,
      id: bigIntToString(servicio.id),
      categoria_id: bigIntToString(servicio.categoria_id),
    }));
    res.json(modifiedServicios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los servicios', details: error.message });
  }
});

// Las demás rutas seguirían el mismo patrón de conversión usando la función `bigIntToString`.

module.exports = router;
