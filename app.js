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