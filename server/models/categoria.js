const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
  descripcion: {
    type: String,
    unique: true,
    required: [true]
  },
  usuario:{
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  }
});//end let categoriaSchema = new Schema


module.exports = mongoose.model('Categoria', categoriaSchema);
