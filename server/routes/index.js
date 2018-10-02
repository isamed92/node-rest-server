const express = require('express');
const app = express();



app.use(require('./login.js'));
app.use(require('./usuario.js'));

module.exports =app;
