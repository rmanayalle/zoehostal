const axios = require('axios');
const entityCliente = require('../entity/cliente');

async function getClienteFromReniec(documentoNacional)
{
  let cliente = {
    documentoNacional: documentoNacional,
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: ""
  };

  cliente = await entityCliente.model.findOne({documentoNacional: documentoNacional}).exec().then(_cliente => {
    if(_cliente !== null)return _cliente;
    return cliente;
  });

  if(cliente.nombre === ""){
    axios.defaults.baseURL = 'http://aplicaciones007.jne.gob.pe';
    return await axios.get('/srop_publico/Consulta/Afiliado/GetNombresCiudadano?DNI=' + documentoNacional)
    .then(async response => {
      let arr = response.data.split("|");
      cliente.apellidoPaterno = arr[0];
      cliente.apellidoMaterno = arr[1];
      cliente.nombre = arr[2];
      if(cliente.nombre !== ""){
        let nuevoCliente = new entityCliente.model(cliente);
        await nuevoCliente.save();
      }
      return cliente;
    });
  }
  return cliente;
}

module.exports = {
  getClienteFromReniec
};
