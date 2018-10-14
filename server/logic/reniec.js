var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function getClienteFromReniec(documentoNacional)
{
  const cliente = {
    documentoNacional: documentoNacional,
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: ""
  };
  const Http = new XMLHttpRequest();
  Http.onreadystatechange = function() {
      if (Http.readyState == 4 && Http.status == 200){
        const array = Http.responseText.split('|');
        cliente.nombre = array[2].toLowerCase();
        cliente.apellidoPaterno = array[0].toLowerCase();
        cliente.apellidoMaterno = array[1].toLowerCase();
      }
  }
  Http.open("GET", 'http://aplicaciones007.jne.gob.pe/srop_publico/Consulta/Afiliado/GetNombresCiudadano?DNI=' + documentoNacional, false);
  Http.send();
  return cliente;
}

module.exports = {
  getClienteFromReniec
};
