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
    // Convertir id de BigInt a String si es necesario
    res.status(201).json({ ...nuevoFooter, id: nuevoFooter.id.toString() });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el registro de footer', details: error.message });
  }
});

// Obtener todos los registros de Footer
router.get('/footer', async (req, res) => {
  try {
    const footer = await prisma.footer.findMany();
    // Convertir id de BigInt a String
    const modifiedFooter = footer.map(record => ({
      ...record,
      id: record.id.toString(),
    }));
    res.json(modifiedFooter);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los registros de footer', details: error.message });
  }
});

// Obtener un registro de Footer por ID
router.get('/footer/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const footer = await prisma.footer.findUnique({
      where: { id },
    });
    if (!footer) return res.status(404).json({ error: 'Registro de footer no encontrado' });
    res.json({ ...footer, id: footer.id.toString() });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el registro de footer', details: error.message });
  }
});

// Actualizar un registro de Footer
router.put('/footer/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { email, telefono, direccion, logo_img, nombre_dueno } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const footerActualizado = await prisma.footer.update({
      where: { id },
      data: { email, telefono, direccion, logo_img, nombre_dueno },
    });
    res.json({ ...footerActualizado, id: footerActualizado.id.toString() });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Registro de footer no encontrado' });
    }
    res.status(500).json({ error: 'Error al actualizar el registro de footer', details: error.message });
  }
});

// Eliminar un registro de Footer
router.delete('/footer/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    await prisma.footer.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Registro de footer no encontrado' });
    }
    res.status(500).json({ error: 'Error al eliminar el registro de footer', details: error.message });
  }
});

module.exports = router;
