const express = require('express')
const route = express.Router()
const UserControllers = require('../controllers/UserController')

// Rutas para el registro de usuarios
route.get('/register', UserControllers.registerget)
route.post('/register', UserControllers.register)

// Rutas para el inicio de sesión de usuarios
route.get('/login', UserControllers.loginget)
route.post('/login', UserControllers.login)

//route.get('/private', UserControllers.private)


module.exports = route