/*const express = require('express');
const app = express();
app.use(express.static('public'));
const path = require('path');
const mongoose = require('mongoose');
const UserModel = require('./models/userModel');  // Ajusta la ruta según tu estructura de archivos
const jwt = require('jsonwebtoken');

const PORT = 3000;

const jwtSecretKey = 'miSecretoSuperSecreto';

const verifyToken = (req, res, next) => {
    // Verifica si hay un token en los headers de la solicitud
    const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token de los headers

    if (!token) {
        // Si no hay token, simplemente continúa con la siguiente función middleware
        return next();
    }

    try {
        // Verifica y decodifica el token
        const decoded = jwt.verify(token, jwtSecretKey);
        req.userId = decoded.userId; // Añadir el userId al objeto req para usarlo en las rutas protegidas

        // Si hay un token y el usuario intenta acceder a /sign_in o /create_account, redirige al localhost:3000
        if (req.url.includes('/sign_in') || req.url.includes('/create_account')) {
            return res.redirect('http://localhost:3000');
        }

        // Si hay un token y el usuario intenta acceder a otras rutas privadas, simplemente continúa con la siguiente función middleware
        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido.' });
    }
};


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

app.get('/', verifyToken, (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {
        // Si hay un token, envía el token al cliente
        res.json({ token });
    } else {
        // Si no hay un token, responde con un mensaje o lo que necesites
        return res.status(400).json({ error: 'El número de teléfono ya está en uso. Por favor, elige otro.' });
    }
});

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

        const token = jwt.sign({ userId: usuarioGuardado._id }, jwtSecretKey);

        res.json({ token });
    
        console.log('Usuario guardado:', usuarioGuardado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar el usuario' });
    }
});

app.post('/sign_in', async (req, res) => {
    const { email, password } = req.body;
  
    // Lógica de autenticación (verificar email y contraseña)
  
    // Supongamos que user contiene la información del usuario autenticado
    const user = await UserModel.findOne({ email });
  
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }
  
    // Generar token JWT
    const token = jwt.sign({ userId: user._id }, jwtSecretKey);
  
    res.json({ token });
  });

app.get('/sign_in', verifyToken, (req, res) => {
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

app.get('/create_account', verifyToken, (req, res) => {
    const filePath = path.join(__dirname, 'public', 'create_account.html');
    
    // Envía el archivo
    res.sendFile(filePath, (err) => {
        if (err) {
            // Manejar errores aquí
            console.error(err);
            res.status(500).send('Error interno del servidor');
        }
    });
});*/


/*----------------------------------------------------------------------------------------------*/
const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const userRoutes = require('./routes/userRoutes')
const path = require('path');

app.use(express.static('public', { 
    setHeaders: (res, path, stat) => {
      if (path.endsWith('.js')) {
        res.set('Content-Type', 'application/javascript');
      }
    }
}));

//middlewares
app.use(bodyParser.json())
app.use(cors())

app.use('/user',userRoutes)

app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    res.sendFile(indexPath);
});

app.listen(port, async () => {
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/web_page_adidas')
        console.log("DB connection successful.");
    }catch(error){
        console.log(`DB connection error:${error}`)
    }
});