const User = require('../models/userModel')
const userUtils= require('../utils/userUtils')
const path = require('path');

const registerget = async (req,res)=>{
    res.sendFile(path.join(__dirname, '../user/html', 'register.html'));
}

const register = async (req,res)=>{
    try{
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
            salt: saltHash.salt
        })
        const token = userUtils.createToken(user.correo);
        res.status(200).json({ token, redirectUrl: 'http://localhost:3000' });
    }catch(error){
        res.status(500).send(error)
    }
}

const loginget = async (req,res)=>{
    res.sendFile(path.join(__dirname, '../user/html', 'login.html'));
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

/*const private = async (req,res)=>{
    const authHeader = req.headers['authorization'] // "Bearer 123213jdskfjgkdsjg"
    const token = authHeader && authHeader.split(' ')[1]// ["Bearer","asdasdsafsdfsdf"]
    const email =  userUtils.validateToken(token)
    if(email.error){
        res.status(401).end()
    }
    else{
        const user = await User.findOne({email:email})
        res.status(200).json(user)
    }
}*/

module.exports = {
    register:register,
    registerget:registerget,
    login:login,
    loginget:loginget
    //private:private
}