const express = require('express')
const routes = express.Router()
const ordenController = require('../controllers/ordenController')

routes.post('/pedidos', ordenController.realizarPedido)

module.exports = routes