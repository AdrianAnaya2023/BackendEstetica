// routes/footerRoutes.js
const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Footer:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del registro del footer
 *         email:
 *           type: string
 *           description: Email del contacto
 *         telefono:
 *           type: string
 *           description: Teléfono del contacto
 *         direccion:
 *           type: string
 *           description: Dirección del contacto
 *         logo_img:
 *           type: string
 *           description: URL del logo de la empresa
 *         nombre_dueno:
 *           type: string
 *           description: Nombre del dueño
 */

/**
 * @swagger
 * /footer:
 *   post:
 *     summary: Crear un nuevo registro en Footer
 *     tags: [Footer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Footer'
 *     responses:
 *       201:
 *         description: Registro de footer creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Footer'
 */
router.post('/footer', async (req, res) => {
  const { email, telefono, direccion, logo_img, nombre_dueno } = req.body;
  try {
    const nuevoFooter = await prisma.footer.create({
      data: { email, telefono, direccion, logo_img, nombre_dueno },
    });
    res.status(201).json(nuevoFooter);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el registro de footer', details: error.message });
  }
});

/**
 * @swagger
 * /footer:
 *   get:
 *     summary: Obtener todos los registros de Footer
 *     tags: [Footer]
 *     responses:
 *       200:
 *         description: Lista de registros de footer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Footer'
 */
router.get('/footer', async (req, res) => {
  try {
    const footer = await prisma.footer.findMany();
    res.json(footer);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los registros de footer' });
  }
});

/**
 * @swagger
 * /footer/{id}:
 *   get:
 *     summary: Obtener un registro de Footer por ID
 *     tags: [Footer]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del registro de footer
 *     responses:
 *       200:
 *         description: Registro de footer encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Footer'
 *       404:
 *         description: Registro de footer no encontrado
 */
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

/**
 * @swagger
 * /footer/{id}:
 *   put:
 *     summary: Actualizar un registro de Footer
 *     tags: [Footer]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del registro de footer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Footer'
 *     responses:
 *       200:
 *         description: Registro de footer actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Footer'
 *       404:
 *         description: Registro de footer no encontrado
 */
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
    res.status(500).json({ error: 'Error al actualizar el registro de footer', details: error.message });
  }
});

/**
 * @swagger
 * /footer/{id}:
 *   delete:
 *     summary: Eliminar un registro de Footer
 *     tags: [Footer]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del registro de footer
 *     responses:
 *       204:
 *         description: Registro de footer eliminado exitosamente
 *       404:
 *         description: Registro de footer no encontrado
 */
router.delete('/footer/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.footer.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el registro de footer', details: error.message });
  }
});

module.exports = router;
