const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/prismaClient');  // Usa tu cliente Prisma

const router = express.Router();

// Ruta de login
router.post('/login', async (req, res) => {
  const { usuario, contrasena } = req.body;

  try {
    const user = await prisma.usuarios.findUnique({
      where: { usuario },
    });

    if (!user) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        usuario: user.usuario,
      },
      process.env.JWT_SECRET,  // Clave secreta desde el .env
      { expiresIn: process.env.JWT_EXPIRATION || '1h' }
    );

    res.json({ message: 'Login exitoso', token });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
