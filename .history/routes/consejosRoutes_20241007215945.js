const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Middleware para validar los datos del consejo
function validateConsejoData(req, res, next) {
  const { titulo, descripcion, imagen, categoria_id } = req.body;
  if (!titulo || !descripcion || !imagen || !categoria_id) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  next();
}

// Crear un nuevo consejo
router.post('/', validateConsejoData, async (req, res) => {
  try {
    const { titulo, descripcion, imagen, categoria_id } = req.body;
    const nuevoConsejo = await prisma.consejos.create({
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
    res.status(201).json({
      ...nuevoConsejo,
      id: nuevoConsejo.id.toString(),
      categoria_id: nuevoConsejo.categoria_id.toString(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el consejo', details: error.message });
  }
});

// Obtener todos los consejos
router.get('/', async (req, res) => {
  try {
    const consejos = await prisma.consejos.findMany({
      include: { categoria: true },
    });
    // Convertir BigInt a string
    const modifiedConsejos = consejos.map((consejo) => ({
      ...consejo,
      id: consejo.id.toString(),
      categoria_id: consejo.categoria_id.toString(),
      categoria: consejo.categoria
        ? { ...consejo.categoria, id: consejo.categoria.id.toString() }
        : null,
    }));
    res.json(modifiedConsejos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los consejos', details: error.message });
  }
});

// Obtener un consejo por ID
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const consejo = await prisma.consejos.findUnique({
      where: { id: BigInt(id) },
      include: { categoria: true },
    });
    if (!consejo) {
      return res.status(404).json({ error: 'Consejo no encontrado' });
    }
    // Convertir BigInt a string
    res.json({
      ...consejo,
      id: consejo.id.toString(),
      categoria_id: consejo.categoria_id.toString(),
      categoria: consejo.categoria
        ? { ...consejo.categoria, id: consejo.categoria.id.toString() }
        : null,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el consejo', details: error.message });
  }
});

// Actualizar un consejo
router.put('/:id', validateConsejoData, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const { titulo, descripcion, imagen, categoria_id } = req.body;

  try {
    const consejoActualizado = await prisma.consejos.update({
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
      ...consejoActualizado,
      id: consejoActualizado.id.toString(),
      categoria_id: consejoActualizado.categoria_id.toString(),
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Consejo no encontrado' });
    }
    res.status(500).json({ error: 'Error al actualizar el consejo', details: error.message });
  }
});

// Eliminar un consejo
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    await prisma.consejos.delete({
      where: { id: BigInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Consejo no encontrado' });
    }
    res.status(500).json({ error: 'Error al eliminar el consejo', details: error.message });
  }
});

// Obtener consejos por categoría
router.get('/categoria/:categoriaId', async (req, res) => {
  const categoriaId = parseInt(req.params.categoriaId);
  if (isNaN(categoriaId)) {
    return res.status(400).json({ error: 'ID de categoría inválido' });
  }

  try {
    const consejos = await prisma.consejos.findMany({
      where: { categoria_id: BigInt(categoriaId) },
      include: { categoria: true },
    });
    // Convertir BigInt a string
    const modifiedConsejos = consejos.map((consejo) => ({
      ...consejo,
      id: consejo.id.toString(),
      categoria_id: consejo.categoria_id.toString(),
      categoria: consejo.categoria
        ? { ...consejo.categoria, id: consejo.categoria.id.toString() }
        : null,
    }));
    res.json(modifiedConsejos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los consejos por categoría', details: error.message });
  }
});

module.exports = router;
