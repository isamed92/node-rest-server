const express = require('express');

const {verificarToken,verificaAdmin_Role} = require('../middlewares/authentication.js');

const app = express();
const Categoria = require('../models/categoria.js');

// =============================
// mostrar todas las categorias
//==============================
app.get('/categoria',verificarToken, (req, res) =>{
  Categoria.find({})
            .populate('usuario', 'nombre email')       // PARA CARGAR INFORMACION DE OTRAS TABLAS populate('nombreDelSchema', 'elementosAMostrar por espacios')
            .sort('descripcion')
            .exec((err, categorias)=>{
              if (err) {
                return res.status(400).json({
                  ok: false,
                  err
                })
              }
              res.json({
                ok:true,
                categorias
              }); //END RES.JSON
            });//END FIND
  // Categoria.find({})
  //          .exec((error, categorias) =>{
  //           if (err) {
  //              return res.status(400).json({ok:false, err});
  //          }

  // });

});


// =============================
// mostrar una categoria por ID
//==============================
app.get('/categoria/:id',verificarToken, (req, res)=>{
  let id= req.params.id;
  Categoria.findById(id, (err, categoriaDB)=>{
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }
    if (!categoriaDB) {
      return res.status(500).json({
        ok: false,
        err:{
          message: 'El ID no es correcto'
        }
      });
    }

    res.json({
      ok:true,
      categoria:categoriaDB
    })

  }); //END findById

});//END GET



// =============================
// crear nueva categoria
//==============================
app.post('/categoria', verificarToken, (req, res) =>{

  let body = req.body;

  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id
  });

  categoria.save((err, categoriaDB)=>{
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err
      })
    }
    res.json({
      ok: true,
      categoria:categoriaDB
    });//end res.json
  });//end save
}); //end post



// =============================
// Actualizar nombre categoria
//==============================
 app.put('/categoria/:id', (req,res)=>{
   let id = req.params.id;
   let body = req.body;


   let descCategoria ={
     descripcion: body.descripcion
   }
   Categoria.findByIdAndUpdate(id, descCategoria, {new: true, runValidators: true}, (err, categoriaDB)=>{
     if (err) {
       return res.status(500).json({
         ok: false,
         err
       })
     }
     if (!categoriaDB) {
       return res.status(400).json({
         ok: false,
         err
       })
     }
     res.json({
       ok: true,
       categoria:categoriaDB
     });//end res.json

   });

 }); // END PUT


// =============================
// eliminar categoria
//condiciones: solo un ADMIN puede borrar categorias
//eliminacion fisica
//solicitar token
//==============================
app.delete('/categoria/:id',[verificarToken,verificaAdmin_Role], (req, res)=>{
  let id = req.params.id;

  Categoria.findByIdAndRemove(id, (err, CategoriaBorrada)=>{
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }
    if (!CategoriaBorrada) {
      return res.status(400).json({
        ok: false,
        err:{
          message: 'El id no existe'
        }
      })
    }
    res.json({
      ok:true,
      message:  'Categoria Borrada'
    });//end res.json

  });//RES findByIdAndRemove

});//END DELETE







module.exports = app;  //MUY IMPORTANTE
