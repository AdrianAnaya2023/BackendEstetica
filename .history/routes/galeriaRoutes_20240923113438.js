// routes/galeriaRoutes.js
const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Galeria:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID de la entrada de la galería
 *         foto_antes:
 *           type: string
 *           description: URL de la foto antes
 *         foto_despues:
 *           type: string
 *           description: URL de la foto después
 *         categoria_id:
 *           type: integer
 *           description: ID de la categoría a la que pertenece la galería
 */

/**
 * @swagger
 * /galeria:
 *   post:
 *     summary: Crear una nueva entrada de galería
 *     tags: [Galería]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Galeria'
 *     responses:
 *       201:
 *         description: Entrada de galería creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Galeria'
 */
router.post('/galeria', async (req, res) => {
  const { foto_antes, foto_despues, categoria_id } = req.body; // Ajuste: cambiar categoriaId a categoria_id
  try {
    const nuevaGaleria = await prisma.galeria.create({
      data: {
        foto_antes,
        foto_despues,
        categoria: {
          connect: { id: categoria_id }, // Conectar usando categoria_id
        },
      },
    });
    res.status(201).json(nuevaGaleria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la galería', details: error.message });
  }
});

/**
 * @swagger
 * /galeria:
 *   get:
 *     summary: Obtener todas las entradas de la galería
 *     tags: [Galería]
 *     responses:
 *       200:
 *         description: Lista de entradas de la galería
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Galeria'
 */
router.get('/galeria', async (req, res) => {
  try {
    const galerias = await prisma.galeria.findMany({ include: { categoria: true } });
    res.json(galerias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las galerías' });
  }
});

/**
 * @swagger
 * /galeria/{id}:
 *   get:
 *     summary: Obtener una entrada de la galería por ID
 *     tags: [Galería]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la entrada de la galería
 *     responses:
 *       200:
 *         description: Entrada de la galería encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Galeria'
 *       404:
 *         description: Entrada de la galería no encontrada
 */
router.get('/galeria/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const galeria = await prisma.galeria.findUnique({
      where: { id: parseInt(id) },
      include: { categoria: true },
    });
    if (!galeria) return res.status(404).json({ error: 'Galería no encontrada' });
    res.json(galeria);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la galería' });
  }
});

/**
 * @swagger
 * /galeria/{id}:
 *   put:
 *     summary: Actualizar una entrada de la galería
 *     tags: [Galería]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la entrada de la galería
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Galeria'
 *     responses:
 *       200:
 *         description: Entrada de la galería actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Galeria'
 *       404:
 *         description: Entrada de la galería no encontrada
 */
router.put('/galeria/:id', async (req, res) => {
  const { id } = req.params;
  const { foto_antes, foto_despues, categoria_id } = req.body; // Ajuste: cambiar categoriaId a categoria_id
  try {
    const galeriaActualizada = await prisma.galeria.update({
      where: { id: parseInt(id) },
      data: {
        foto_antes,
        foto_despues,
        categoria: {
          connect: { id: categoria_id }, // Conectar usando categoria_id
        },
      },
    });
    res.json(galeriaActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la galería', details: error.message });
  }
});

/**
 * @swagger
 * /galeria/{id}:
 *   delete:
 *     summary: Eliminar una entrada de la galería
 *     tags: [Galería]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la entrada de la galería
 *     responses:
 *       204:
 *         description: Entrada de la galería eliminada exitosamente
 *       404:
 *         description: Entrada de la galería no encontrada
 */
router.delete('/galeria/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.galeria.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la galería', details: error.message });
  }
});

module.exports = router;
