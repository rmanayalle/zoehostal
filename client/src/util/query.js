import gql from "graphql-tag";

const GET_HABITACION = gql`
  query habitacion(
    $habitacion: HabitacionPartialInput!
  ){
    habitacion(habitacion: $habitacion){
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
      fechaInicio
      fechaFinal
      registro{
        detalle{
          fechaInicio
          fechaFinal
          precio
        }
        pago{
          fecha
          monto
        }
      }
    }
  }
`;

const GET_PRESUPUESTO = gql`
  query presupuestar(
    $habitacion: HabitacionPartialInput!,
    $fechaInicio: Date!,
    $fechaFinal: Date!
  ){
    presupuestar(
      habitacion: $habitacion,
      fechaInicio: $fechaInicio,
      fechaFinal: $fechaFinal
    ){
      total
      detalle{
        fechaInicio
        fechaFinal
        precio
      }
    }
  }
`;

export {
  GET_HABITACION,
  GET_PRESUPUESTO
}
