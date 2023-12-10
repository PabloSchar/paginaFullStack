const express = require('express')
const routes = express.Router()
const ordenController = require('../controllers/ordenController')

//Se usa para crear un nuevo pedido
routes.post('/pedidos', ordenController.realizarPedido)

//Se usa para acceder a la pestaña de pedidos(admin)
routes.get('/admin/pedidos', ordenController.pedidosget);

//Se usa para obtener todos los pedidos(admin)
routes.get('/pedidos/getall', ordenController.pedidosgetall);

//Se usa para marcar el pedido como entregado(admin)
routes.post('/pedidos/marcar-entregado', ordenController.pedidosentregado);

//Se usa para acceder a la pestaña del pedido seleccionado(admin)
routes.get('/pedidos/detalles/:idPedido', ordenController.abrirDetallesPedido);

//Se usa para obtener los detalles del pedido seleccionado(admin)
routes.get('/api/pedidos/:idPedido', ordenController.obtenerDetallesPedido);

module.exports = routes