// routes/consejosRoutes.js
const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// CRUD similar al de Productos con ajustes según el modelo Consejos
router.post('/consejos', async (req, res) => {
  const { titulo, descripcion, imagen, categoriaId } = req.body;
  try {
    const nuevoConsejo = await prisma.consejos.create({
      data: { titulo, descripcion, imagen, categoriaId },
    });
    res.status(201).json(nuevoConsejo);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el consejo' });
  }
});

router.get('/consejos', async (req, res) => {
  try {
    const consejos = await prisma.consejos.findMany({ include: { categoria: true } });
    res.json(consejos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los consejos' });
  }
});

router.get('/consejos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const consejo = await prisma.consejos.findUnique({ where: { id: parseInt(id) } });
    if (!consejo) return res.status(404).json({ error: 'Consejo no encontrado' });
    res.json(consejo);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el consejo' });
  }
});

router.put('/consejos/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, imagen, categoriaId } = req.body;
  try {
    const consejoActualizado = await prisma.consejos.update({
      where: { id: parseInt(id) },
      data: { titulo, descripcion, imagen, categoriaId },
    });
    res.json(consejoActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el consejo' });
  }
});

router.delete('/consejos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.consejos.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el consejo' });
  }
});

module.exports = router;
