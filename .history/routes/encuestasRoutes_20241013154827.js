const express = require('express');
const prisma = require('../prisma/prismaClient');
const router = express.Router();

// Función utilitaria para convertir BigInt a string
function convertBigIntToString(obj) {
  if (Array.isArray(obj)) {
    return obj.map(item => convertBigIntToString(item));
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        if (typeof value === 'bigint') {
          return [key, value.toString()];
        } else if (typeof value === 'object') {
          return [key, convertBigIntToString(value)];
        }
        return [key, value];
      })
    );
  }
  return obj;
}

// Obtener todas las encuestas
router.get('/encuestas', async (req, res) => {
  try {
    const encuestas = await prisma.encuestas.findMany();
    const modifiedEncuestas = convertBigIntToString(encuestas);
    res.json(modifiedEncuestas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las encuestas', details: error.message });
  }
});

// Obtener una encuesta por ID
router.get('/encuestas/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const encuesta = await prisma.encuestas.findUnique({
      where: { id },
    });
    if (!encuesta) return res.status(404).json({ error: 'Encuesta no encontrada' });
    
    const modifiedEncuesta = convertBigIntToString(encuesta);
    res.json(modifiedEncuesta);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la encuesta', details: error.message });
  }
});

// Registrar respuestas a la encuesta (actualizar "bueno", "malo", "regular")
router.post('/encuestas/:id/responder', async (req, res) => {
  const id = parseInt(req.params.id);
  const { respuesta } = req.body;

  if (isNaN(id) || !respuesta) {
    return res.status(400).json({ error: 'ID inválido o respuesta faltante' });
  }

  try {
    // Obtener la encuesta actual
    const encuesta = await prisma.encuestas.findUnique({
      where: { id: BigInt(id) },
    });

    if (!encuesta) {
      return res.status(404).json({ error: 'Encuesta no encontrada' });
    }

    // Actualizar el campo correspondiente según la respuesta enviada
    let updateData = {};
    if (respuesta === 'bueno') {
      updateData = { bueno: encuesta.bueno + 1n }; // Sumar 1 a "bueno"
    } else if (respuesta === 'malo') {
      updateData = { malo: encuesta.malo + 1n }; // Sumar 1 a "malo"
    } else if (respuesta === 'regular') {
      updateData = { regular: encuesta.regular + 1n }; // Sumar 1 a "regular"
    } else {
      return res.status(400).json({ error: 'Respuesta inválida' });
    }

    // Actualizar la encuesta
    const encuestaActualizada = await prisma.encuestas.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    const modifiedEncuesta = convertBigIntToString(encuestaActualizada);
    res.json(modifiedEncuesta);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar la respuesta', details: error.message });
  }
});

// Resetear los valores de bueno, malo y regular a 0 en una encuesta (en lugar de eliminar)
router.delete('/encuestas/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const encuestaReset = await prisma.encuestas.update({
      where: { id },
      data: {
        bueno: 0,
        malo: 0,
        regular: 0,
      },
    });
    const modifiedEncuesta = convertBigIntToString(encuestaReset);
    res.json(modifiedEncuesta);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Encuesta no encontrada' });
    }
    res.status(500).json({ error: 'Error al resetear la encuesta', details: error.message });
  }
});

module.exports = router;
