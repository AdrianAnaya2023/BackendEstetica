// routes/encuestasRoutes.js
const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Encuesta:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID de la encuesta
 *         pregunta:
 *           type: string
 *           description: Pregunta de la encuesta
 *         bueno:
 *           type: integer
 *           description: Número de votos positivos
 *         malo:
 *           type: integer
 *           description: Número de votos negativos
 *         regular:
 *           type: integer
 *           description: Número de votos regulares
 */

/**
 * @swagger
 * /encuestas:
 *   post:
 *     summary: Crear una nueva encuesta
 *     tags: [Encuestas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Encuesta'
 *     responses:
 *       201:
 *         description: Encuesta creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Encuesta'
 */
router.post('/encuestas', async (req, res) => {
  const { pregunta, bueno, malo, regular } = req.body;
  try {
    const nuevaEncuesta = await prisma.encuestas.create({
      data: { pregunta, bueno, malo, regular },
    });
    res.status(201).json(nuevaEncuesta);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la encuesta', details: error.message });
  }
});

/**
 * @swagger
 * /encuestas:
 *   get:
 *     summary: Obtener todas las encuestas
 *     tags: [Encuestas]
 *     responses:
 *       200:
 *         description: Lista de encuestas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Encuesta'
 */
router.get('/encuestas', async (req, res) => {
  try {
    const encuestas = await prisma.encuestas.findMany();
    res.json(encuestas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las encuestas' });
  }
});

/**
 * @swagger
 * /encuestas/{id}:
 *   get:
 *     summary: Obtener una encuesta por ID
 *     tags: [Encuestas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la encuesta
 *     responses:
 *       200:
 *         description: Encuesta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Encuesta'
 *       404:
 *         description: Encuesta no encontrada
 */
router.get('/encuestas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const encuesta = await prisma.encuestas.findUnique({
      where: { id: parseInt(id) },
    });
    if (!encuesta) return res.status(404).json({ error: 'Encuesta no encontrada' });
    res.json(encuesta);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la encuesta' });
  }
});

/**
 * @swagger
 * /encuestas/{id}:
 *   put:
 *     summary: Actualizar una encuesta
 *     tags: [Encuestas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la encuesta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Encuesta'
 *     responses:
 *       200:
 *         description: Encuesta actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Encuesta'
 *       404:
 *         description: Encuesta no encontrada
 */
router.put('/encuestas/:id', async (req, res) => {
  const { id } = req.params;
  const { pregunta, bueno, malo, regular } = req.body;
  try {
    const encuestaActualizada = await prisma.encuestas.update({
      where: { id: parseInt(id) },
      data: { pregunta, bueno, malo, regular },
    });
    res.json(encuestaActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la encuesta', details: error.message });
  }
});

/**
 * @swagger
 * /encuestas/{id}:
 *   delete:
 *     summary: Eliminar una encuesta
 *     tags: [Encuestas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la encuesta
 *     responses:
 *       204:
 *         description: Encuesta eliminada exitosamente
 *       404:
 *         description: Encuesta no encontrada
 */
router.delete('/encuestas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.encuestas.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la encuesta', details: error.message });
  }
});

module.exports = router;
