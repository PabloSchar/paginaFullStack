const User = require('../models/userModel')
const userUtils= require('../utils/userUtils')
const path = require('path');
const Carrito = require('../models/carritoModel')

const registerget = async (req,res)=>{
    res.sendFile(path.join(__dirname, '../views/user', 'register.html'));
}

const register = async (req,res)=>{
    try{
        const existingUser = await User.findOne({
            $or: [{ correo: req.body.correo }, { nombreusuario: req.body.nombreusuario }],
        });

        // Si ya existe un usuario con el mismo correo o nombre de usuario, devuelve un error
        if (existingUser) {
            return res.status(400).json({ message: 'Correo o nombre de usuario ya están en uso.' });
        }
        const saltHash = userUtils.generateHash(req.body.password)
        const user = await User.create({
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            nombreusuario: req.body.nombreusuario,
            correo: req.body.correo,
            numeroTelefono: req.body.numeroTelefono,
            codigoPostal: req.body.codigoPostal,
            provincia: req.body.provincia,
            ciudad: req.body.ciudad,
            direccion: req.body.direccion,
            password: saltHash.hash ,
            salt: saltHash.salt,
            role: 'cliente'
        })
        const token = userUtils.createToken(user.correo);

        const carrito = await Carrito.create({
            usuarioEmail: user.correo,
            productos: [],
            total: 0,
        });
        res.status(200).json({ token, redirectUrl: 'http://localhost:3000' });
    }catch(error){
        res.status(500).send(error)
    }
}

const loginget = async (req,res)=>{
    res.sendFile(path.join(__dirname, '../views/user', 'login.html'));
}

const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        // Verifica si el identificador es un correo electrónico
        const isEmail = /\S+@\S+\.\S+/.test(identifier);

        let user;

        if (isEmail) {
            user = await User.findOne({ correo: identifier });
        } else {
            user = await User.findOne({ nombreusuario: identifier });
        }

        if (user) {
            const isValid = userUtils.comparePassword(password, user.password, user.salt);

            if (isValid) {
                const token = userUtils.createToken(user.correo);
                res.status(200).json({ token, redirectUrl: 'http://localhost:3000' });
            } else {
                res.status(401).json({ error: 'Contraseña incorrecta' });
            }
        } else {
            res.status(401).json({ error: 'Usuario o correo inválido' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

const perfilget = async (req,res)=>{
    res.sendFile(path.join(__dirname, '../views/user', 'perfil.html'));
}

const perfilpageget = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        // Verifica el token y extrae el correo del usuario
        const correo = userUtils.verifyTokenSendEmail(token);
    
        if (!correo) {
            return res.status(401).json({ message: 'Token inválido o usuario no autenticado.' });
        }

        const usuarioEncontrado = await User.findOne({ correo: correo });

        if (!usuarioEncontrado) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        
        res.json({
            nombre: usuarioEncontrado.nombre,
            apellido: usuarioEncontrado.apellido,
            nombreusuario: usuarioEncontrado.nombreusuario,
            correo: usuarioEncontrado.correo,
            numeroTelefono: usuarioEncontrado.numeroTelefono,
            codigoPostal: usuarioEncontrado.codigoPostal,
            provincia: usuarioEncontrado.provincia,
            ciudad: usuarioEncontrado.ciudad,
            direccion: usuarioEncontrado.direccion
        });
    } catch (error) {
        console.error('Error al obtener datos del perfil:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

const isadminrout = async (req, res) => {

};

const allusersget = async (req,res)=>{
    res.sendFile(path.join(__dirname, '../views/user', 'allusers.html'));
}

const alluserssend = async (req,res)=>{
    try {
        const users = await User.find();

        // Responde con la lista de usuarios
        res.json(users);
    } catch (error) {
        console.error('Error al obtener la lista de usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

const allusersdelete = async (req,res)=>{
    const userId = req.params.id;

    try {
        // Busca el usuario por su ID y eliminarlo de la base de datos
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Responde con el usuario eliminado o un mensaje de éxito
        res.json(deletedUser);
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

const allusersrole = async (req,res)=>{
    const userId = req.params.id;
    const { role } = req.body;

    try {
        // Busca el usuario por su ID y actualizar su rol en la base de datos
        const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Responde con el usuario actualizado
        res.json(updatedUser);
    } catch (error) {
        console.error('Error al cambiar el rol del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = {
    register:register,
    registerget:registerget,
    login:login,
    loginget:loginget,
    perfilget:perfilget,
    perfilpageget:perfilpageget,
    isadminrout:isadminrout,
    allusersget:allusersget,
    alluserssend:alluserssend,
    allusersdelete:allusersdelete,
    allusersrole:allusersrole
}