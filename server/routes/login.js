const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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


// CONFIGURACIONES DE GOOGLE



async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();


  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  };
}//end async function
// verify().catch(console.error);




app.post('/google',async (req, res) => {
  let token = req.body.idtoken;

  let googleUser =await verify(token).catch(e =>{
    res.status(403).json({
      ok:false,
      err:e
    })
  });//end googleUser
  Usuario.findOne({email: googleUser.email}, (err, usuarioDB) =>{
    if (err) {
      return res.status(500).json({ok:false, err});
    }

    if (usuarioDB) {
      if (usuarioDB.google ===false) {
        return res.status(400).json({ok:false, err:{
          message: 'debe de usar su autenticacion normal'
        }});
      }else {
        let token = jwt.sign({
          usuario: usuarioDB
        },
        process.env.SEED,
        {
          expiresIn: process.env.CADUCIDAD_TOKEN
        });//end let token
        return res.json({
          ok: true,
          usuario: usuarioDB,
          token
        })

      }
    } else {
      //SI el usuario no existe en la BD
      let usuario = new Usuario();

      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ':)';

      usuario.save( (err, usuarioDB)=>{
        if (err) {
          return res.status(500).json({ok:false, err});
        }
        let token = jwt.sign({
          usuario: usuarioDB
        },
        process.env.SEED,
        {
          expiresIn: process.env.CADUCIDAD_TOKEN
        });//end let token
        return res.json({
          ok: true,
          usuario: usuarioDB,
          token
        }); //end return

      }); //end save

    }//end else




  });//end findOne



  // res.json({
  //   usuario: googleUser
  // });



});






module.exports = app;
