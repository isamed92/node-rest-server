require('./config/config.js');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const path = require('path');

const app = express();

//body bodyParser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//configuracion global de rutas
app.use(require('./routes/index.js'));

//habilitar la carpeta public para ser accedida desde cualquier lugar
app.use(express.static(path.resolve(__dirname,'../public')));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true },(error, respuesta)=>{
  if (error) throw error;
  console.log('Base de datos ONLINE');
}); //conexion a la base de datos



app.listen(process.env.PORT, ()=>console.log(`escuchando puerto ${process.env.PORT}`));
