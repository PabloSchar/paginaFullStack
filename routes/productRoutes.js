const express = require('express')
const routes = express.Router()
const productsControllers = require('../controllers/productsController')

routes.get('/products', productsControllers.products)

routes.get('/products/count', productsControllers.productsCount);

routes.get('/products/addnew', productsControllers.productsaddnewget)

routes.post('/products/addnew', productsControllers.productsaddnewpost)

//route.get('/private', UserControllers.private)


module.exports = routes