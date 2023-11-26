const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel')

const generateHash = (password) => {
    try {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
        return {
            salt: salt,
            hash: hash
        };
    } catch (error) {
        console.error('Error generating hash:', error);
        throw error;
    }
};

const comparePassword = (password,hash,salt)=>{
    const newHash  = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);

    return newHash === hash
}

const createToken = (correo)=>{
    const payload = {
        correo: correo,
    };
    return jwt.sign(payload, 'token-secreto');
}

const isAdmin = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
      const decoded = jwt.verify(token, 'token-secreto');

      // Busca el usuario en la base de datos por el correo almacenado en el token
      const user = await User.findOne({ correo: decoded.correo });

      if (!user) {
          return res.status(401).json({ message: 'Usuario no encontrado' });
      }

      // Verifica el rol
      if (user.role === 'admin') {
          // El usuario es un administrador, permitir el acceso a la ruta
          return res.status(200).json({ message: 'Operación exitosa' });
      } else {
          // El usuario no es un administrador, denegar el acceso
          return res.status(403).json({ message: 'Acceso no autorizado' });
      }
  } catch (err) {
      return res.status(401).json({ message: 'Token inválido' });
  }
};

const verifyTokenSendEmail = (token) => {
    try {
        const decoded = jwt.verify(token, 'token-secreto');
        return decoded.correo;
    } catch (error) {
        console.error('Error al verificar el token:', error);
        return null;
    }
};



module.exports = {
    generateHash:generateHash,
    comparePassword:comparePassword,
    createToken:createToken,
    isAdmin:isAdmin,
    verifyTokenSendEmail:verifyTokenSendEmail
}