import gql from "graphql-tag";

const GET_HABITACION = gql`
query habitacion(
  $habitacion: HabitacionInput!
){
  habitacion(
    habitacion: $habitacion
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
      pago{
        fecha
        monto
      }
    }
  }
}
`;

const GET_PRESUPUESTO = gql`
query presupuesto(
  $tarifa: Float!,
  $fechaInicio: Date!,
  $fechaFinal: Date!
){
  presupuesto(
    tarifa: $tarifa,
    fechaInicio: $fechaInicio,
    fechaFinal: $fechaFinal
  ){
    total
    totalNeedsToBeCashed
    detalle{
      fechaInicio
      fechaFinal
      precio
      needsToBeCashed
    }
  }
}
`;

export {
  GET_HABITACION,
  GET_PRESUPUESTO
}
