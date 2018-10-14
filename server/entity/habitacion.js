var mongoose = require('mongoose');
var entityCliente = require('./cliente');

var schema = new mongoose.Schema({
  nombre: String,
  tipo: String,
  tarifa: Number,
  capacidad: Number,
  estado: String,
  cliente: entityCliente.schema,
  hospedaje: {
    fechaInicio: Date,
    fechaFinal: Date,
    cronologia: {
      total: Number,
      totalNeedsToBeCashed: Number,
      detalle: [{
        fechaInicio: Date,
        fechaFinal: Date,
        precio: Number,
        needsToBeCashed: Boolean
      }]
    },
    pago: {
      total: Number,
      detalle: [{
        fecha: Date,
        monto: Number
      }]
    }
  }
});

var model = mongoose.model('habitacione', schema);

module.exports = {
  model,
  schema
};
