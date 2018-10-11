const type = `
  type Cliente{
    documentoNacional: String
    nombre: String
    apellidoPaterno: String
    apellidoMaterno: String
  }

  input ClienteInput {
    documentoNacional: String
    nombre: String
    apellidoPaterno: String
    apellidoMaterno: String
  }
`;

module.exports = {
  type
};
