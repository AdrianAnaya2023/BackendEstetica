// routes/consejosRoutes.js
const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Consejo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del consejo
 *         titulo:
 *           type: string
 *           description: Título del consejo
 *         descripcion:
 *           type: string
 *           description: Descripción del consejo
 *         imagen:
 *           type: string
 *           description: URL de la imagen del consejo
 *         categoria_id:
 *           type: integer
 *           description: ID de la categoría a la que pertenece el consejo
 */

/**
 * @swagger
 * /consejos:
 *   post:
 *     summary: Crear un nuevo consejo
 *     tags: [Consejos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Consejo'
 *     responses:
 *       201:
 *         description: Consejo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consejo'
 */
router.post('/consejos', async (req, res) => {
  const { titulo, descripcion, imagen, categoria_id } = req.body; // Cambiado de categoriaId a categoria_id
  try {
    const nuevoConsejo = await prisma.consejos.create({
      data: {
        titulo,
        descripcion,
        imagen,
        categoria: {
          connect: { id: categoria_id }, // Conectar usando categoria_id
        },
      },
    });
    res.status(201).json(nuevoConsejo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el consejo', details: error.message });
  }
});

/**
 * @swagger
 * /consejos:
 *   get:
 *     summary: Obtener todos los consejos
 *     tags: [Consejos]
 *     responses:
 *       200:
 *         description: Lista de consejos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Consejo'
 */
router.get('/consejos', async (req, res) => {
  try {
    const consejos = await prisma.consejos.findMany({ include: { categoria: true } });
    res.json(consejos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los consejos' });
  }
});

/**
 * @swagger
 * /consejos/{id}:
 *   get:
 *     summary: Obtener un consejo por ID
 *     tags: [Consejos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del consejo
 *     responses:
 *       200:
 *         description: Consejo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consejo'
 *       404:
 *         description: Consejo no encontrado
 */
router.get('/consejos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const consejo = await prisma.consejos.findUnique({
      where: { id: parseInt(id) },
      include: { categoria: true },
    });
    if (!consejo) return res.status(404).json({ error: 'Consejo no encontrado' });
    res.json(consejo);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el consejo' });
  }
});

/**
 * @swagger
 * /consejos/{id}:
 *   put:
 *     summary: Actualizar un consejo
 *     tags: [Consejos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del consejo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Consejo'
 *     responses:
 *       200:
 *         description: Consejo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consejo'
 *       404:
 *         description: Consejo no encontrado
 */
router.put('/consejos/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, imagen, categoria_id } = req.body; // Cambiado de categoriaId a categoria_id
  try {
    const consejoActualizado = await prisma.consejos.update({
      where: { id: parseInt(id) },
      data: {
        titulo,
        descripcion,
        imagen,
        categoria: {
          connect: { id: categoria_id }, // Conectar usando categoria_id
        },
      },
    });
    res.json(consejoActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el consejo', details: error.message });
  }
});

/**
 * @swagger
 * /consejos/{id}:
 *   delete:
 *     summary: Eliminar un consejo
 *     tags: [Consejos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del consejo
 *     responses:
 *       204:
 *         description: Consejo eliminado exitosamente
 *       404:
 *         description: Consejo no encontrado
 */
router.delete('/consejos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.consejos.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el consejo', details: error.message });
  }
});

module.exports = router;
