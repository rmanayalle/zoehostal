var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  documentoNacional: String,
  nombre: String,
  apellidoPaterno: String,
  apellidoMaterno: String
});

var model = mongoose.model('cliente', schema);

module.exports = {
  model,
  schema
};
