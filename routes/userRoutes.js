const express = require('express')
const route = express.Router()
const UserControllers = require('../controllers/UserController')
const userUtils = require('../utils/userUtils')

// Rutas para el registro de usuarios
route.get('/register', UserControllers.registerget)
route.post('/register', UserControllers.register)

// Rutas para el inicio de sesión de usuarios
route.get('/login', UserControllers.loginget)
route.post('/login', UserControllers.login)

//vista del perfil
route.get('/perfil', UserControllers.perfilget)

//se usa para obtener todos los datos del usuario
route.get('/perfil-page', UserControllers.perfilpageget)

//vista de usuarios(admin)
route.get('/allusers', UserControllers.allusersget)

//se usa para recibir todos los usuarios(admin)
route.get('/api/users', UserControllers.alluserssend)

//se usa para borrar el usuario(admin)
route.delete('/api/users/:id', UserControllers.allusersdelete)

//se usa para actualizar el rol del usuario(admin)
route.put('/api/users/:id/role', UserControllers.allusersrole)

//se usa para verificar si es admin
route.get('/isadmin', userUtils.isAdmin, UserControllers.isadminrout)

module.exports = route