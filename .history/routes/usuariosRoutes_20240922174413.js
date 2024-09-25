// routes/usuariosRoutes.js
const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Crear un nuevo usuario
router.post('/usuarios', async (req, res) => {
  const { usuario, contrasena } = req.body;
  try {
    const nuevoUsuario = await prisma.usuarios.create({
      data: { usuario, contrasena },
    });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

// Obtener todos los usuarios
router.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await prisma.usuarios.findMany();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// Obtener un usuario por ID
router.get('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await prisma.usuarios.findUnique({
      where: { id: parseInt(id) },
    });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

// Actualizar un usuario
router.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { usuario, contrasena } = req.body;
  try {
    const usuarioActualizado = await prisma.usuarios.update({
      where: { id: parseInt(id) },
      data: { usuario, contrasena },
    });
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

// Eliminar un usuario
router.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.usuarios.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

module.exports = router;
