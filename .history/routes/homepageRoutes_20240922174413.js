// routes/homepageRoutes.js
const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Crear un nuevo registro en Homepage
router.post('/homepage', async (req, res) => {
  const { descripcion, foto_dueno, fotos_local } = req.body;
  try {
    const nuevoHomepage = await prisma.homepage.create({
      data: { descripcion, foto_dueno, fotos_local },
    });
    res.status(201).json(nuevoHomepage);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el registro de homepage' });
  }
});

// Obtener todos los registros de Homepage
router.get('/homepage', async (req, res) => {
  try {
    const homepage = await prisma.homepage.findMany();
    res.json(homepage);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los registros de homepage' });
  }
});

// Obtener un registro de Homepage por ID
router.get('/homepage/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const homepage = await prisma.homepage.findUnique({
      where: { id: parseInt(id) },
    });
    if (!homepage) return res.status(404).json({ error: 'Registro de homepage no encontrado' });
    res.json(homepage);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el registro de homepage' });
  }
});

// Actualizar un registro de Homepage
router.put('/homepage/:id', async (req, res) => {
  const { id } = req.params;
  const { descripcion, foto_dueno, fotos_local } = req.body;
  try {
    const homepageActualizado = await prisma.homepage.update({
      where: { id: parseInt(id) },
      data: { descripcion, foto_dueno, fotos_local },
    });
    res.json(homepageActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el registro de homepage' });
  }
});

// Eliminar un registro de Homepage
router.delete('/homepage/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.homepage.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el registro de homepage' });
  }
});

module.exports = router;
