var mongoose = require('mongoose');
var entityCliente = require('./cliente');

var schema = new mongoose.Schema({
  isClosed: Boolean,
  fecha: Date,
  inicial: Number,
  historia: {
    total: Number,
    hospedaje: [{
      fecha: Date,
      monto: Number,
      habitacion: {
        nombre: String,
        tipo: String,
        tarifa: Number
      },
      cliente: entityCliente.schema
    }],
    otro: [{
      fecha: Date,
      monto: Number,
      asunto: String
    }]
  }
});

var model = mongoose.model('caja', schema);

module.exports = {
  model,
  schema
};
