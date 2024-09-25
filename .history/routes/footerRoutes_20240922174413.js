// routes/footerRoutes.js
const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Crear un nuevo registro en Footer
router.post('/footer', async (req, res) => {
  const { email, telefono, direccion, logo_img, nombre_dueno } = req.body;
  try {
    const nuevoFooter = await prisma.footer.create({
      data: { email, telefono, direccion, logo_img, nombre_dueno },
    });
    res.status(201).json(nuevoFooter);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el registro de footer' });
  }
});

// Obtener todos los registros de Footer
router.get('/footer', async (req, res) => {
  try {
    const footer = await prisma.footer.findMany();
    res.json(footer);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los registros de footer' });
  }
});

// Obtener un registro de Footer por ID
router.get('/footer/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const footer = await prisma.footer.findUnique({
      where: { id: parseInt(id) },
    });
    if (!footer) return res.status(404).json({ error: 'Registro de footer no encontrado' });
    res.json(footer);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el registro de footer' });
  }
});

// Actualizar un registro de Footer
router.put('/footer/:id', async (req, res) => {
  const { id } = req.params;
  const { email, telefono, direccion, logo_img, nombre_dueno } = req.body;
  try {
    const footerActualizado = await prisma.footer.update({
      where: { id: parseInt(id) },
      data: { email, telefono, direccion, logo_img, nombre_dueno },
    });
    res.json(footerActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el registro de footer' });
  }
});

// Eliminar un registro de Footer
router.delete('/footer/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.footer.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el registro de footer' });
  }
});

module.exports = router;
