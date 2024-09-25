// routes/categoriaConsejosRoutes.js
const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Rutas CRUD para CategoriaConsejos
router.post('/categorias-consejos', async (req, res) => {
  const { nombre, descripcion, imagen } = req.body;
  try {
    const nuevaCategoria = await prisma.categoriaConsejos.create({
      data: { nombre, descripcion, imagen },
    });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la categoría de consejos' });
  }
});

router.get('/categorias-consejos', async (req, res) => {
  try {
    const categorias = await prisma.categoriaConsejos.findMany();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías de consejos' });
  }
});

// Continuar con rutas similares a las anteriores...
