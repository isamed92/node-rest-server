const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();


const Usuario = require('../models/usuario.js');
const Producto = require('../models/producto.js');


// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
  let tipo = req.params.tipo;
  let id = req.params.id;



  if (!req.files)
    return res.status(400).json({
      ok: false,
      err:{
        message: 'Ningun archivo seleccionado'
      }
    });

    //validar tipo
    let tiposValidos =['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
      return res.status(400).json({
        ok: false,
        err:{
          message: `Las tipos permitidos son ${tiposValidos}`
        }
      });

    }



    let archivo = req.files.archivo;

    let nombreArchivo = archivo.name.split('.');
    let extencion= nombreArchivo[nombreArchivo.length-1];

    // console.log(extencion);


    // Extenciones permitidas
    let extencionesValidas = ['png', 'jpg', 'gif', 'jgep'];

    if (extencionesValidas.indexOf(extencion)<0) {
      return res.status(400).json({
        ok: false,
        err:{
          message: `Las extenciones validas son ${extencionesValidas}`,
          ext: extencion
        }
      });

    }






    //Cambiar nombre del archivo para procurar que sea unico y diferente
  let nombreImagen = `${id}-${new Date().getMilliseconds()}.${extencion}`


    // Use the mv() method to place the file somewhere on your server
  archivo.mv(`uploads/${tipo}/${nombreImagen}`, (err) =>{
    if (err)
      return res.status(500).json({
        ok: false,
        err
      });


//Aqui, la imagen esta cargada.
switch (tipo) {
  case 'usuarios':
    imagenUsuario(id, res, nombreImagen);
    break;
  case 'productos':
    imagenProducto(id, res, nombreImagen);
    break;
  default:
  return res.status(400).json({
    ok: false,
    err:{
      message: 'Solo puede se pueden cargar productos o usuarios'
    }
  });

}
  }); //END mv



});


function imagenUsuario(id, res, nombre){
  Usuario.findById(id, (err, usuarioDB)=>{
    if (err){
      borraArchivo(nombre, 'usuarios');
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!usuarioDB) {
      borraArchivo(nombre, 'usuarios');
      return res.status(400).json({
        ok: false,
        err:{
          message: 'El usuario no existe'
        }
      });
    }

    // let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);
    // if (fs.existsSync(pathImagen)) {
    //   fs.unlinkSync(pathImagen);   //Borrar algun archivo
    // }
    borraArchivo(usuarioDB.img, 'usuarios');
    usuarioDB.img = nombre;
    usuarioDB.save( (err, userSave)=>{
      res.json({
        ok:true,
        usuario: userSave,
        img: nombre
      });
    });
  });
}
function imagenProducto(id, res, nombre){
  Producto.findById(id, (err, productoDB)=>{
    if (err){
      borraArchivo(nombre, 'productos');
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!productoDB) {
      borraArchivo(nombre, 'productos');
      return res.status(400).json({
        ok: false,
        err:{
          message: 'El producto no existe'
        }
      });
    }
    borraArchivo(productoDB.img, 'productos');
    productoDB.img= nombre;
    productoDB.save( (err, productoActualizado)=>{
      res.json({
        ok: true,
        producto: productoActualizado
      })
    }); //END save





  });
}



function borraArchivo(nombreImagen, tipo){
  let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);   //Borrar algun archivo
  }
}

module.exports = app;
