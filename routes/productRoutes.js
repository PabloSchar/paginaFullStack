const express = require('express')
const routes = express.Router()
const productsControllers = require('../controllers/productsController')
//const path = require('path');

/*routes.use(express.static('public', { 
    setHeaders: (res, path, stat) => {
      if (path.endsWith('.js')) {
        res.set('Content-Type', 'application/javascript');
      }
    }
}));*/

routes.get('/products', productsControllers.products)

routes.get('/products/addnew', productsControllers.productsaddnewget)

routes.post('/products/addnew', productsControllers.productsaddnewpost)


//route.get('/private', UserControllers.private)


module.exports = routes