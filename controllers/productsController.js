const Product = require('../models/productsModel')
const path = require('path');

const products = async (req,res)=>{
    const page = parseInt(req.query.page) || 1;
    const perPage = 6;

    try {
        const products = await Product.find()
            .skip((page - 1) * perPage)
            .limit(perPage);

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al recuperar productos' });
    }
}

const productsaddnewget = async (req,res)=>{
    res.sendFile(path.join(__dirname, '../products/html', 'productsaddnew.html'));
}

const productsaddnewpost = async (req,res)=>{
    try {
        const producto = await Product.create({
            productName: req.body.productName,
            productPrice: req.body.productPrice,
            productStock: req.body.productStock,
            productImage: req.body.productImage,
            productDescription: req.body.productDescription
        })

        res.status(201).json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar un nuevo producto' });
    }
}

module.exports = {
    products:products,
    productsaddnewget:productsaddnewget,
    productsaddnewpost:productsaddnewpost
    //private:private
}