const express = require('express')
const route = express.Router()
const UserControllers = require('../controllers/UserController')
const path = require('path');

route.use(express.static('public', { 
    setHeaders: (res, path, stat) => {
      if (path.endsWith('.js')) {
        res.set('Content-Type', 'application/javascript');
      }
    }
}));

route.post('/register', UserControllers.register)

route.get('/register', (req, res) => {
    const filePath = path.join(__dirname, '..', 'public', 'register.html');
    
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error interno del servidor');
        }
    });
});

route.post('/login', UserControllers.login)

route.get('/login', (req, res) => {
    const filePath = path.join(__dirname, '..', 'public', 'login.html');
    
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error interno del servidor');
        }
    });
});

//route.get('/private', UserControllers.private)


module.exports = route