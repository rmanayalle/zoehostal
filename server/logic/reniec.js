var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function getClienteFromReniec(documentoNacional)
{
  const persona = {
    documentoNacional: documentoNacional,
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: ""
  };
  const Http = new XMLHttpRequest();
  Http.onreadystatechange = function() {
      if (Http.readyState == 4 && Http.status == 200){
        const array = Http.responseText.split('|');
        persona.nombre = array[2];
        persona.apellidoPaterno = array[0];
        persona.apellidoMaterno = array[1];
      }
  }
  Http.open("GET", 'http://aplicaciones007.jne.gob.pe/srop_publico/Consulta/Afiliado/GetNombresCiudadano?DNI=' + documentoNacional, false);
  Http.send();
  return persona;
}

module.exports = {
  getClienteFromReniec
};
