const type = `

  type HabitacionHospedajePago{
    fecha: Date
    monto: Float
  }

  type HabitacionHospedaje {
    fechaInicio: Date
    fechaFinal: Date
    cronologia: [Presupuesto]
    pago: [HabitacionHospedajePago]
  }

  type Habitacion{
    nombre: String
    tipo: String
    tarifa: Float
    capacidad: Int
    estado: String
    cliente: Cliente
    hospedaje: HabitacionHospedaje
  }

  input HabitacionInput {
    nombre: String
    tipo: String
    tarifa: Float
    capacidad: Int
    estado: String
  }
`;

module.exports = {
  type
};
