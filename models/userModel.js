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
    role: {
        type: String,
        enum: ['cliente', 'admin'],
        default: 'cliente',
    },
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;