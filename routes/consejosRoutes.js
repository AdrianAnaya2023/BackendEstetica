const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Crear un nuevo consejo
router.post('/consejos', async (req, res) => {
  const { titulo, descripcion, imagen, categoria_id } = req.body;
  try {
    const nuevoConsejo = await prisma.consejos.create({
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
    res.status(201).json({ ...nuevoConsejo, id: nuevoConsejo.id.toString() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el consejo', details: error.message });
  }
});

// Obtener todos los consejos
router.get('/consejos', async (req, res) => {
  try {
    const consejos = await prisma.consejos.findMany({ include: { categoria: true } });
    // Convertir id de BigInt a String
    const modifiedConsejos = consejos.map(consejo => ({
      ...consejo,
      id: consejo.id.toString(),
      categoria: consejo.categoria ? { ...consejo.categoria, id: consejo.categoria.id.toString() } : null,
    }));
    res.json(modifiedConsejos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los consejos', details: error.message });
  }
});

// Obtener un consejo por ID
router.get('/consejos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const consejo = await prisma.consejos.findUnique({
      where: { id },
      include: { categoria: true },
    });
    if (!consejo) return res.status(404).json({ error: 'Consejo no encontrado' });
    res.json({ ...consejo, id: consejo.id.toString(), categoria: consejo.categoria ? { ...consejo.categoria, id: consejo.categoria.id.toString() } : null });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el consejo', details: error.message });
  }
});

// Actualizar un consejo
router.put('/consejos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, descripcion, imagen, categoria_id } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const consejoActualizado = await prisma.consejos.update({
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
    res.json({ ...consejoActualizado, id: consejoActualizado.id.toString() });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Consejo no encontrado' });
    }
    res.status(500).json({ error: 'Error al actualizar el consejo', details: error.message });
  }
});

// Eliminar un consejo
router.delete('/consejos/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    await prisma.consejos.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Consejo no encontrado' });
    }
    res.status(500).json({ error: 'Error al eliminar el consejo', details: error.message });
  }
});

module.exports = router;
