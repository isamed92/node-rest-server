const jsonwebtoken = require('jsonwebtoken');


//====================
//Verificar token
//====================

let verificarToken = (req, res, next)=>{
  let token = req.get('token'); // con el .get obtenemos los headers
  jsonwebtoken.verify(token, process.env.SEED, (err, decode)=>{
    if (err) {
      return res.status(401).json({ //error 401: no autorizado
        ok:false,
        err: {
          message: 'Token incorrecto'
        }
      });
    }
    req.usuario = decode.usuario;
    // console.log(req.usuario);
    next()
  })//end verify
};
//====================
//Verifica ADMIN_ROLE
//====================
let verificaAdmin_Role = (req, res, next)=>{
  let usuario = req.usuario;


  if (usuario.role === 'ADMIN_ROLE') {
    next();
  }else {
    return res.status(400).json({ //error 401: no autorizado
      ok:false,
      err: {
        message: 'No tiene las credenciales correctas para realizar la operacion'
      }
    });
  }


};

module.exports = {
  verificarToken,
  verificaAdmin_Role
}
