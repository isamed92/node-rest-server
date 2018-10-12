const express = require('express');
const _ = require('underscore');


const {verificarToken}= require('../middlewares/authentication.js');

let app = express();

let Producto = require('../models/producto.js');

/*=============================================>>>>>
=  =Obtener todos los productos
===============================================>>>>>*/
app.get('/productos',verificarToken, (req, res)=>{
  //trae todos los productos
  //populate usuario categoria
  //paginado
  let desde = req.query.desde || 0;
  desde = Number(desde);
  let limite = req.query.limite || 5;
  limite = Number(limite)

  Producto.find({disponible:true})
            .skip(desde)
            .limit(limite)
            .populate('usuario', 'nombre email')       // PARA CARGAR INFORMACION DE OTRAS TABLAS populate('nombreDelSchema', 'elementosAMostrar por espacios')
            .populate('categoria', 'descripcion')
            .sort('descripcion')
            .exec((err, productos)=>{
              if (err) {
                return res.status(400).json({
                  ok: false,
                  err
                })
              }
              res.json({
                ok:true,
                productos
              }); //END RES.JSON
            });//END FIND
}); // END GET

/*=============================================>>>>>
=  obtener un producto por id=
===============================================>>>>>*/
app.get('/productos/:id', verificarToken, (req, res)=>{
  //populate usuario categoria
  let id= req.params.id;
  Producto.findById(id, (err, productoDB)=>{
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }
    if (!productoDB) {
      return res.status(500).json({
        ok: false,
        err:{
          message: 'El ID no es correcto'
        }
      });
    }

    res.json({
      ok:true,
      producto:productoDB
    })

  })
  .populate('usuario', 'nombre email')
  .populate('categoria', 'descripcion'); //END findById
}); // END GET

/*=============================================>>>>>
= Buscar Productos =
===============================================>>>>>*/
app.get('/productos/buscar/:termino',verificarToken, (req, res)=>{
  let termino = req.params.termino;

  let regex = new RegExp(termino, 'i');
  Producto.find({nombre: regex})
                .populate('categoria', 'descripcion')
                .exec( (err, productos)=>{
                  if (err) {
                    return res.status(400).json({
                      ok: false,
                      err
                    })
                  }
                  res.json({
                    ok:true,
                    productos
                  })

                })

}); //END get

/*=============================================>>>>>
= Crear un producto =
===============================================>>>>>*/

app.post('/productos', verificarToken, (req,res)=>{
    let body = req.body;
    // let idCategoria= req.params.id;
    let producto = new Producto({
      nombre: body.nombre,
      precioUni: body.precioUni,
      descripcion: body.descripcion,
      // categoria: req.categoria.,
      categoria: body.categoria,
      usuario: req.usuario._id
    }); //END let producto
    producto.save((err, productoDB)=>{
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      res.status(201).json({
        ok: true,
        producto: productoDB
      });//end res.json
    }); //END save


});//END post


/*=============================================>>>>>
= Actualizar un producto =
===============================================>>>>>*/

app.put('/productos/:id',verificarToken, (req, res)=>{
  let idProducto = req.params.id;
  let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);

  Producto.findByIdAndUpdate(idProducto, body, {new: true, runValidators: true},
    (err, productoDB) =>{
      if (err) {
        return res.status(500).json({
          ok: false,
          err:{
            message: 'No se pudo conectar a la base de datos'
          }
        })
      }
      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err:{
            message: 'No se encontro el producto'
          }
        })
      }
      res.json({
        ok: true,
        producto: productoDB
      });//end res.json
    }); //END findByIdAndUpdate
}); // END PUT

/*=============================================>>>>>
= borrar un producto =
===============================================>>>>>*/
app.delete('/productos/:id',verificarToken, (req, res)=>{
  let id = req.params.id;
  let cambiaEstado={
    disponible:false
  }
  Producto.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, productoBorrado)=>{
    if (err) {
      return res.status(500).json({
        ok: false,
        err:{
          message: 'No se pudo conectar a la base de datos'
        }
      })
    }
    if (!productoBorrado) {
      return res.status(400).json({
        ok: false,
        err:{
          message: 'No se encontro el producto'
        }
      })
    }
    res.json({ok:true, producto: productoBorrado});
  });//END findByIdAndUpdate

});//END delete


module.exports = app;
