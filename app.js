const express = require('express');
const app = express();
app.use(express.static('public'));
const path = require('path');
const mongoose = require('mongoose');
const UserModel = require('./userModel');  // Ajusta la ruta según tu estructura de archivos


const PORT = 3000;

app.listen(PORT, () => {
    mongoose.connect('mongodb://127.0.0.1:27017/web_page_adidas').then(()=>{
        console.log("DB connection successful.");
    })
    .catch((err)=>{
        console.log(`DB connection error:${err}`);
    });
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

app.use(express.json());

app.use('/public', express.static('public', { 
    setHeaders: (res, path, stat) => {
      if (path.endsWith('.js')) {
        res.set('Content-Type', 'application/javascript');
      }
    }
}));

app.post('/create_account', async (req, res) => {
    const userData = req.body;
  
    try {
      // Verificar si el correo ya está en uso
        const usuarioExistenteCorreo = await UserModel.findOne({ correo: userData.correo });
        if (usuarioExistenteCorreo) {
            return res.status(400).json({ error: 'El correo electrónico ya está en uso. Por favor, elige otro.' });
        }

        // Verificar si el nombre de usuario ya está en uso
        const usuarioExistenteUsername = await UserModel.findOne({ nombreusuario: userData.nombreusuario });
        if (usuarioExistenteUsername) {
            return res.status(400).json({ error: 'El nombre de usuario ya está en uso. Por favor, elige otro.' });
        }

        // Verificar si el número de teléfono ya está en uso
        const usuarioExistenteTelefono = await UserModel.findOne({ numeroTelefono: userData.numeroTelefono });
        if (usuarioExistenteTelefono) {
            return res.status(400).json({ error: 'El número de teléfono ya está en uso. Por favor, elige otro.' });
        }
  
      // Si el correo no está en uso, guardar el nuevo usuario
        const nuevoUsuario = new UserModel(userData);
        const usuarioGuardado = await nuevoUsuario.save();
    
        console.log('Usuario guardado:', usuarioGuardado);
        res.status(200).json({ message: 'Usuario registrado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar el usuario' });
    }
});

app.get('/sign_in', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'sign_in.html');
    
    // Envía el archivo
    res.sendFile(filePath, (err) => {
        if (err) {
            // Manejar errores aquí
            console.error(err);
            res.status(500).send('Error interno del servidor');
        }
    });
});

app.get('/create_account', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'create_account.html');
    
    // Envía el archivo
    res.sendFile(filePath, (err) => {
        if (err) {
            // Manejar errores aquí
            console.error(err);
            res.status(500).send('Error interno del servidor');
        }
    });
});
