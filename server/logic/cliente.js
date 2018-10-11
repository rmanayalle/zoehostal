var _cliente = require('../model/cliente');

function getCliente(args){
  return _cliente.model.findOne(args.cliente).exec();
}

module.exports = {
  getCliente
};
