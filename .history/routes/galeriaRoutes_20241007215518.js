const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Middleware para validar los datos de la galería
function validateGaleriaData(req, res, next) {
  const { foto_antes, foto_despues, categoria_id } = req.body;
  if (!foto_antes || !foto_despues || !categoria_id) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  next();
}

// Crear una nueva entrada en la galería
router.post('/', validateGaleriaData, async (req, res) => {
  try {
    const { foto_antes, foto_despues, categoria_id } = req.body;
    const nuevaGaleria = await prisma.galeria.create({
      data: {
        foto_antes,
        foto_despues,
        categoria: {
          connect: { id: BigInt(categoria_id) },
        },
      },
    });
    // Convertir BigInt a string
    res.status(201).json({
      ...nuevaGaleria,
      id: nuevaGaleria.id.toString(),
      categoria_id: nuevaGaleria.categoria_id.toString(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la entrada de galería', details: error.message });
  }
});

// Obtener todas las entradas de galería
router.get('/', async (req, res) => {
  try {
    const galerias = await prisma.galeria.findMany({
      include: { categoria: true },
    });
    // Convertir BigInt a string
    const modifiedGalerias = galerias.map((galeria) => ({
      ...galeria,
      id: galeria.id.toString(),
      categoria_id: galeria.categoria_id.toString(),
      categoria: galeria.categoria
        ? { ...galeria.categoria, id: galeria.categoria.id.toString() }
        : null,
    }));
    res.json(modifiedGalerias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las entradas de galería', details: error.message });
  }
});

// Obtener una entrada de galería por ID
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const galeria = await prisma.galeria.findUnique({
      where: { id: BigInt(id) },
      include: { categoria: true },
    });
    if (!galeria) {
      return res.status(404).json({ error: 'Entrada de galería no encontrada' });
    }
    // Convertir BigInt a string
    res.json({
      ...galeria,
      id: galeria.id.toString(),
      categoria_id: galeria.categoria_id.toString(),
      categoria: galeria.categoria
        ? { ...galeria.categoria, id: galeria.categoria.id.toString() }
        : null,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la entrada de galería', details: error.message });
  }
});

// Actualizar una entrada de galería
router.put('/:id', validateGaleriaData, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const { foto_antes, foto_despues, categoria_id } = req.body;

  try {
    const galeriaActualizada = await prisma.galeria.update({
      where: { id: BigInt(id) },
      data: {
        foto_antes,
        foto_despues,
        categoria: {
          connect: { id: BigInt(categoria_id) },
        },
      },
    });
    // Convertir BigInt a string
    res.json({
      ...galeriaActualizada,
      id: galeriaActualizada.id.toString(),
      categoria_id: galeriaActualizada.categoria_id.toString(),
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Entrada de galería no encontrada' });
    }
    res.status(500).json({ error: 'Error al actualizar la entrada de galería', details: error.message });
  }
});

// Eliminar una entrada de galería
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    await prisma.galeria.delete({
      where: { id: BigInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Entrada de galería no encontrada' });
    }
    res.status(500).json({ error: 'Error al eliminar la entrada de galería', details: error.message });
  }
});

// Obtener entradas de galería por categoría
router.get('/categoria/:categoriaId', async (req, res) => {
  const categoriaId = parseInt(req.params.categoriaId);
  if (isNaN(categoriaId)) {
    return res.status(400).json({ error: 'ID de categoría inválido' });
  }

  try {
    const galerias = await prisma.galeria.findMany({
      where: { categoria_id: BigInt(categoriaId) },
      include: { categoria: true },
    });
    // Convertir BigInt a string
    const modifiedGalerias = galerias.map((galeria) => ({
      ...galeria,
      id: galeria.id.toString(),
      categoria_id: galeria.categoria_id.toString(),
      categoria: galeria.categoria
        ? { ...galeria.categoria, id: galeria.categoria.id.toString() }
        : null,
    }));
    res.json(modifiedGalerias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las entradas de galería por categoría', details: error.message });
  }
});

module.exports = router;
