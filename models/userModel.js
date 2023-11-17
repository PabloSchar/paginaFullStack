const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    nombreusuario: String,
    correo: String,
    numeroTelefono: String,
    codigoPostal: String,
    provincia: String,
    ciudad: String,
    direccion: String,
    password: String,
    salt: String,
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;