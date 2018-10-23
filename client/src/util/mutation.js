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

const POST_PAY = gql`
mutation pay(
  $habitacionNombre: String!,
  $monto: Float!
){
  pay(
    habitacionNombre: $habitacionNombre,
    monto: $monto
  ){
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

const POST_CLIENTE = gql`
mutation cliente($cliente: ClienteInput!) {
  cliente(cliente: $cliente) {
    documentoNacional
    nombre
    apellidoPaterno
    apellidoMaterno
  }
}
`;

const POST_FECHA_FINAL = gql`
mutation fechaFinal($habitacionNombre: String!, $fechaFinal: Date!) {
  fechaFinal(habitacionNombre: $habitacionNombre, fechaFinal: $fechaFinal) {
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

const POST_FREE = gql`
mutation free($habitacionNombre: String!) {
  free(habitacionNombre: $habitacionNombre) {
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

export {
  POST_RENT,
  POST_PAY,
  POST_CLIENTE,
  POST_FECHA_FINAL,
  POST_FREE
}
