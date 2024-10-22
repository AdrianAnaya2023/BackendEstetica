const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Middleware para validar los datos de una entrada de galería
function validateGaleriaData(req, res, next) {
  const { foto_antes, foto_despues, categoria_id } = req.body;
  if (!foto_antes || !foto_despues || !categoria_id) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  next();
}

// Crear una nueva entrada de galería
router.post('/galeria', validateGaleriaData, async (req, res) => {
  const { foto_antes, foto_despues, categoria_id } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!foto_antes || !foto_despues || !categoria_id) {
    return res.status(400).json({ error: 'Todos los campos (foto_antes, foto_despues, categoria_id) son requeridos.' });
  }

  try {
    const nuevaGaleria = await prisma.galeria.create({
      data: {
        foto_antes,
        foto_despues,
        categoria: {
          connect: { id: BigInt(categoria_id) },  // Convertir categoria_id a BigInt
        },
      },
    });
    // Convertir BigInt a string y devolver la respuesta con el estado 201 (creado)
    res.status(201).json({
      ...nuevaGaleria,
      id: nuevaGaleria.id.toString(),
      categoria_id: nuevaGaleria.categoria_id.toString()
    });
  } catch (error) {
    console.error('Error al crear la galería:', error);
    res.status(500).json({ error: 'Error al crear la galería', details: error.message });
  }
});


// Obtener todas las entradas de la galería
router.get('/galeria', async (req, res) => {
  try {
    const galerias = await prisma.galeria.findMany({
      include: { categoria: true }
    });

    // Convertir todos los BigInt a String
    const modifiedGalerias = galerias.map(galeria => ({
      ...galeria,
      id: galeria.id.toString(),
      categoria: galeria.categoria 
        ? { ...galeria.categoria, id: galeria.categoria.id.toString() }
        : null,
    }));

    res.json(modifiedGalerias);
  } catch (error) {
    console.error('Error al obtener las galerías:', error);
    res.status(500).json({ error: 'Error al obtener las galerías', details: error.message });
  }
});



// Obtener entradas de la galería por categoría
router.get('/galeria/categoria/:categoriaId', async (req, res) => {
  const categoriaId = parseInt(req.params.categoriaId);
  if (isNaN(categoriaId)) {
    return res.status(400).json({ error: 'ID de categoría inválido' });
  }
  try {
    const galerias = await prisma.galeria.findMany({
      where: { categoria_id: BigInt(categoriaId) },  // Convertir categoria_id a BigInt
      include: { categoria: true },
    });
    const modifiedGalerias = galerias.map(galeria => ({
      ...galeria,
      id: galeria.id.toString(),
      categoria: galeria.categoria ? { ...galeria.categoria, id: galeria.categoria.id.toString() } : null,
    }));
    res.json(modifiedGalerias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las galerías por categoría', details: error.message });
  }
});

// Obtener una entrada de la galería por ID
router.get('/galeria/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  const bigIntId = BigInt(id);

  try {
    const galeria = await prisma.galeria.findUnique({
      where: { id: bigIntId },
      include: { categoria: true },
    });
    if (!galeria) return res.status(404).json({ error: 'Galería no encontrada' });
    res.json({ 
      ...galeria, 
      id: galeria.id.toString(), 
      categoria: galeria.categoria ? { ...galeria.categoria, id: galeria.categoria.id.toString() } : null 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la galería', details: error.message });
  }
});

// Actualizar una entrada de la galería
router.put('/galeria/:id', validateGaleriaData, async (req, res) => {
  const id = parseInt(req.params.id);
  const { foto_antes, foto_despues, categoria_id } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  const bigIntId = BigInt(id);

  try {
    const galeriaActualizada = await prisma.galeria.update({
      where: { id: bigIntId },
      data: {
        foto_antes,
        foto_despues,
        categoria: {
          connect: { id: BigInt(categoria_id) },
        },
      },
    });
    res.json({ ...galeriaActualizada, id: galeriaActualizada.id.toString() });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Galería no encontrada' });
    }
    res.status(500).json({ error: 'Error al actualizar la galería', details: error.message });
  }
});

// Eliminar una entrada de la galería
router.delete('/galeria/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  const bigIntId = BigInt(id);

  try {
    await prisma.galeria.delete({
      where: { id: bigIntId },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Galería no encontrada' });
    }
    res.status(500).json({ error: 'Error al eliminar la galería', details: error.message });
  }
});

module.exports = router;
