
// ================================
//Puerto
//=================================
process.env.PORT = process.env.PORT || 3000;





// ================================
// Entorno
//=================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ================================
// Vencimiento del token
//=================================
// la duracion es  60 segundos
//                 60 minutos
//                 24 horas
//                 30 dias
process.env.CADUCIDAD_TOKEN = '48h';

// ================================
// SEED de autenticacion
//=================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'



// ================================
// Base de datos
//=================================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/cafe';
}else {
  urlDB = process.env.MONGO_URI;
}


//google client id
process.env.CLIENT_ID = process.env.CLIENT_ID || '866970757377-senlpdsea4u0bhn0ao30l9r2c0pgev50.apps.googleusercontent.com';

process.env.URLDB = urlDB;
