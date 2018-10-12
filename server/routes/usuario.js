const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const {verificarToken,verificaAdmin_Role} = require('../middlewares/authentication.js');

const app = express();
const Usuario = require('../models/usuario.js');


app.get('/usuario', verificarToken, (req, res) => {
  let desde = req.query.desde || 0;

  desde = Number(desde);

  let limite = req.query.limite || 5;

  limite = Number(limite)

  Usuario.find({estado:true}, 'nombre email role estado google img') //segundo argumento, para hacer exclusiones
              .skip(desde)   //se salta los primeros 5
              .limit(limite)  //trae solo 5
              .exec((err, usuarios) => {
                if (err) {
                  return res.status(400).json({ok:false, err})
                }
                Usuario.count({estado:true}, (err, conteo ) =>{
                  res.json({ ok:true, usuarios, cuantos : conteo});
                })

              });
}); //end app.GET


//POST
app.post('/usuario', [verificarToken, verificaAdmin_Role],(req, res)=> {



  let body = req.body;
  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password:bcrypt.hashSync(body.password, 10), //HASH
    role: body.role
  });

  usuario.save((err, usuarioDB) =>{
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    // usuarioDB.password = null;

    res.json({
      ok:true,
      usuario: usuarioDB
    });
  })//end save
});

app.put('/usuario/:identificacion',[verificarToken,verificaAdmin_Role], function (req, res) {
  let id = req.params.identificacion;
  let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

  Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true},
    (err, usuarioDB)=>{
    if (err) {
      return res.status(400).json({ok:false, err})
    }
    res.json({id, usuario: usuarioDB});

  });
});

app.delete('/usuario/:id', [verificarToken,verificaAdmin_Role],
      function (req, res) {
          let id = req.params.id;
          let cambiaEstado={
            estado:false
          }

          Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true},
          (err, usuarioBorradoLogico)=>{
            if (err) {
            return res.status(400).json({ok:false, err})
            }
            if (usuarioBorradoLogico == null) {
              return res.status(400).json({
                ok:false,
                err:{
                  message: 'usuario no encontrado'
                }}); //end return
              }//end if
            res.json({ok:true, id, usuario: usuarioBorradoLogico})
        });




          /*Usuario.findByIdAndRemove(id, (err, usuarioBorrado) =>{
            if (err) {
              return res.status(400).json({ok:false, err})
            }
            if (usuarioBorrado == null) {
              return res.status(400).json({
                ok:false,
                err:{
                  message: 'usuario no encontrado'
                }}); //end return
              }//end if
              res.json({ok: true, usuario: usuarioBorrado});
            });//end findByIdAndRemove   */



});//end app.delete


module.exports = app;
