const entityCliente = require('../entity/cliente');

async function addCliente(cliente){
  cliente.nombre = cliente.nombre.toUpperCase();
  cliente.apellidoPaterno = cliente.apellidoPaterno.toUpperCase();
  cliente.apellidoMaterno = cliente.apellidoMaterno.toUpperCase();
  let _cliente = new entityCliente.model(cliente);
  await _cliente.save();
  return _cliente;
}

module.exports = {
  addCliente
}
