const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);  // Verificar token con JWT_SECRET
    req.user = decoded;  // Guardar los datos del token decodificado en req.user
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};

module.exports = authenticateToken;
