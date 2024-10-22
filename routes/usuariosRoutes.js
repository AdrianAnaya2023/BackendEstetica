const express = require('express');
const prisma = require('../prisma/prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware para validar los datos del usuario
function validateUserData(req, res, next) {
    const { usuario, contrasena } = req.body;
    if (!usuario || !contrasena) {
        return res.status(400).json({ error: 'El campo usuario y contrasena son requeridos' });
    }
    next();
}

// Ruta para crear un nuevo usuario
// Hashear contraseña antes de guardar el usuario
// Ruta para crear un nuevo usuario
router.post('/', validateUserData, async (req, res) => {
    try {
        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(req.body.contrasena, 10);

        const nuevoUsuario = await prisma.usuarios.create({
            data: {
                usuario: req.body.usuario,
                contrasena: hashedPassword // Guardar la contraseña hasheada
            }
        });

        res.status(201).json({ ...nuevoUsuario, id: nuevoUsuario.id.toString() }); // Convertir BigInt id a string
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el usuario', details: error.message });
    }
});
// Ruta para obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const usuarios = await prisma.usuarios.findMany();
        const modifiedUsuarios = usuarios.map(user => ({
            ...user,
            id: user.id.toString() // Convertir BigInt id a String
        }));
        res.json(modifiedUsuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios', details: error.message });
    }
});

// Ruta para obtener un usuario por ID
router.get('/:id', async (req, res) => {
    try {
        const usuario = await prisma.usuarios.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ ...usuario, id: usuario.id.toString() }); // Convertir BigInt id a string
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el usuario', details: error.message });
    }
});

// Ruta para actualizar un usuario por ID
router.put('/:id', validateUserData, async (req, res) => {
    try {
        const usuarioActualizado = await prisma.usuarios.update({
            where: { id: parseInt(req.params.id) },
            data: {
                usuario: req.body.usuario,
                contrasena: req.body.contrasena
            }
        });
        res.json({ ...usuarioActualizado, id: usuarioActualizado.id.toString() }); // Convertir BigInt id a string
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(500).json({ error: 'Error al actualizar el usuario', details: error.message });
    }
});

// Ruta para eliminar un usuario por ID
router.delete('/:id', async (req, res) => {
    try {
        await prisma.usuarios.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(500).json({ error: 'Error al eliminar el usuario', details: error.message });
    }
});

// Ruta de login
// Ruta de login
router.post('/login', async (req, res) => {
    const { usuario, contrasena } = req.body;

    console.log('Datos recibidos del frontend:', { usuario, contrasena });

    try {
        // Buscar al usuario por el nombre de usuario usando findFirst
        const user = await prisma.usuarios.findFirst({
            where: { usuario },
        });

        // Verificar si el usuario existe
        if (!user) {
            console.log('Usuario no encontrado:', usuario);
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        console.log('Usuario encontrado:', user);

        // Comparar la contraseña ingresada con la almacenada usando bcrypt
        const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
        if (!isPasswordValid) {
            console.log('Contraseña incorrecta para el usuario:', usuario);
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        console.log('Autenticación exitosa para el usuario:', usuario);

        // Convertir BigInt a string
        const userId = user.id.toString();

        // Generar un token JWT si la autenticación es correcta
        const token = jwt.sign(
            {
                id: userId,  // Asegurarse de que id sea un string
                usuario: user.usuario,
            },
            process.env.JWT_SECRET,  // Clave secreta para firmar el token
            { expiresIn: process.env.JWT_EXPIRATION || '1h' } // Expiración del token
        );

        // Enviar el token al frontend
        console.log('Token generado:', token);
        res.json({ message: 'Login exitoso', token });
    } catch (error) {
        console.error('Error en el servidor durante el login:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});



  
module.exports = router;
