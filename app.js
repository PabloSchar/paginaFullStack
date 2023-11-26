const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')
const carritoRoutes = require('./routes/carritoRoutes')
const path = require('path');

//middlewares
app.use(bodyParser.json())
app.use(cors())

app.use(express.static(path.join(__dirname, "fe")));

// Rutas de usuario
app.use('/user', userRoutes);

// Rutas de productos
app.use('/', productRoutes);

// Rutas de carrito
app.use('/', carritoRoutes);

app.listen(port, async () => {
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/web_page_adidas')
        console.log("DB connection successful.");
    }catch(error){
        console.log(`DB connection error:${error}`)
    }
});