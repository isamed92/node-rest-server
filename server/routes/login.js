const express = require('express');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');


const app = express();
const Usuario = require('../models/usuario.js');


app.post('/login', (req, res) => {
  let body = req.body;

  Usuario.findOne({email: body.email}, (err, userDB) =>{
    if (err) {
      return res.status(500).json({ok:false, err});
    }
    if (userDB===null) {
      return res.status(400).json({
        ok:false,
        err:{
          message: '(Usuario) o contraseña incorrectos'
        }
      }); //end return
    } // end if(!usuarioDB)
    if (!bcrypt.compareSync(body.password, userDB.password)) {
      return res.status(400).json({
        ok:false,
        err:{
          message: 'contraseña incorrecta'
        }
      }); //end return
    }//end if

    let token = jwt.sign({
      usuario: userDB
    },
    process.env.SEED,
    {
      expiresIn: process.env.CADUCIDAD_TOKEN
    });//end let token
    res.json({
      ok:true,
      usuario: userDB,
      token
    });
});//end findOne

}); //end POST


















module.exports = app;
