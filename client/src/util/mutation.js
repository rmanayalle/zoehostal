import gql from "graphql-tag";

const POST_ALQUILAR = gql`
  mutation alquilar(
    $habitacion: HabitacionPartialInput!,
    $cliente: ClienteInput!,
    $fechaFinal: Date!
  ){
    alquilar(
      habitacion: $habitacion,
      cliente: $cliente,
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

const POST_PAGAR = gql`
  mutation pagar(
    $habitacion: HabitacionPartialInput!,
    $monto: Float!
  ){
    pagar(
      habitacion: $habitacion,
      monto: $monto
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

export {
  POST_ALQUILAR,
  POST_PAGAR
}
