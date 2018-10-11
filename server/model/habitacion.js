var mongoose = require('mongoose');
var _cliente = require('./cliente');

var schema = new mongoose.Schema({
  nombre: String,
  tipo: String,
  tarifa: Number,
  capacidad: Number,
  estado: String,
  cliente: _cliente.schema,
  fechaInicio: Date,
  fechaFinal: Date,
  registro: {
    detalle: [{
      fechaInicio: Date,
      fechaFinal: Date,
      precio: Number
    }],
    pago: [{
      fecha: Date,
      monto: Number
    }]
  }
});

var model = mongoose.model('habitacione', schema);

module.exports = {
  model,
  schema
};
