import gql from "graphql-tag";

const POST_RENT = gql`
mutation rent(
  $habitacionNombre: String!,
  $documentoNacional: String!
  $fechaFinal: Date!
){
  rent(
    habitacionNombre: $habitacionNombre,
    documentoNacional: $documentoNacional,
    fechaFinal: $fechaFinal
  ){
    nombre
    tipo
    tarifa
    capacidad
    estado
    cliente{
      documentoNacional
      nombre
      apellidoPaterno
      apellidoMaterno
    }
    hospedaje{
      fechaInicio
      fechaFinal
      cronologia{
        total
        totalNeedsToBeCashed
        detalle{
          fechaInicio
          fechaFinal
          precio
          needsToBeCashed
        }
      }
      pago{
        fecha
        monto
      }
    }
  }
}
`;

const POST_PAY = gql`
mutation pay(
  $habitacionNombre: String!,
  $monto: Float!
){
  pay(
    habitacionNombre: $habitacionNombre,
    monto: $monto
  ){
    fecha
    monto
  }
}
`;

export {
  POST_RENT,
  POST_PAY
}
