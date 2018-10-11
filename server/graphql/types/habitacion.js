const type = `

  type HabitacionRegistroPago{
    fecha: Date
    monto: Float
  }

  type HabitacionRegistroDetalle{
    fechaInicio: Date
    fechaFinal: Date
    precio: Float
  }

  type HabitacionRegistro{
    detalle: [HabitacionRegistroDetalle]
    pago: [HabitacionRegistroPago]
  }

  type Habitacion{
    nombre: String
    tipo: String
    tarifa: Float
    capacidad: Int
    estado: String
    cliente: Cliente
    fechaInicio: Date
    fechaFinal: Date
    registro: HabitacionRegistro
  }

  type HabitacionOcupado {
    nombre: String
    tipo: String
    deuda: Float
  }

  input HabitacionPartialInput {
    nombre: String
    tipo: String
    tarifa: Float
    capacidad: Int
    estado: String
    fechaInicio: Date
    fechaFinal: Date
  }
`;

module.exports = {
  type
};
