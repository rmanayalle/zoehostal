import gql from "graphql-tag";

const GET_HABITACION = gql`
query habitacion($habitacion: HabitacionInput!) {
  habitacion(habitacion: $habitacion) {
    nombre
    tipo
    tarifa
    capacidad
    estado
    cliente {
      documentoNacional
      nombre
      apellidoPaterno
      apellidoMaterno
    }
    hospedaje {
      fechaInicio
      fechaFinal
      cronologia {
        total
        totalNeedsToBeCashed
        detalle {
          fechaInicio
          fechaFinal
          precio
          needsToBeCashed
        }
      }
      pago {
        total
        detalle {
          fecha
          monto
        }
      }
    }
  }
}
`;

const GET_PRESUPUESTO = gql`
query presupuesto(
  $tarifa: Float!,
  $fechaInicio: Date,
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

const GET_CLIENTE = gql`
query cliente($documentoNacional: String!) {
  cliente(documentoNacional: $documentoNacional) {
    documentoNacional
    nombre
    apellidoPaterno
    apellidoMaterno
  }
}
`;

const GET_DATE = gql`
{
  date
}
`;

export {
  GET_HABITACION,
  GET_PRESUPUESTO,
  GET_CLIENTE,
  GET_DATE
}
