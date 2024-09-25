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
    // Convertir id de BigInt a String si es necesario
    res.status(201).json({ ...nuevoHomepage, id: nuevoHomepage.id.toString() });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el registro de homepage', details: error.message });
  }
});

// Obtener todos los registros de Homepage
router.get('/homepage', async (req, res) => {
  try {
    const homepage = await prisma.homepage.findMany();
    // Convertir id de BigInt a String
    const modifiedHomepage = homepage.map(record => ({
      ...record,
      id: record.id.toString(),
    }));
    res.json(modifiedHomepage);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los registros de homepage', details: error.message });
  }
});

// Obtener un registro de Homepage por ID
router.get('/homepage/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const homepage = await prisma.homepage.findUnique({
      where: { id },
    });
    if (!homepage) return res.status(404).json({ error: 'Registro de homepage no encontrado' });
    res.json({ ...homepage, id: homepage.id.toString() });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el registro de homepage', details: error.message });
  }
});

// Actualizar un registro de Homepage
router.put('/homepage/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { descripcion, foto_dueno, fotos_local } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const homepageActualizado = await prisma.homepage.update({
      where: { id },
      data: { descripcion, foto_dueno, fotos_local },
    });
    res.json({ ...homepageActualizado, id: homepageActualizado.id.toString() });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Registro de homepage no encontrado' });
    }
    res.status(500).json({ error: 'Error al actualizar el registro de homepage', details: error.message });
  }
});

// Eliminar un registro de Homepage
router.delete('/homepage/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    await prisma.homepage.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Registro de homepage no encontrado' });
    }
    res.status(500).json({ error: 'Error al eliminar el registro de homepage', details: error.message });
  }
});

module.exports = router;
