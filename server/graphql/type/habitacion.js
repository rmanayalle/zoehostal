const type = `

  type HabitacionHospedajePagoDetalle{
    fecha: Date
    monto: Float
  }

  type HabitacionHospedajePago{
    total: Float
    detalle: [HabitacionHospedajePagoDetalle]
  }

  type HabitacionHospedaje {
    fechaInicio: Date
    fechaFinal: Date
    cronologia: Presupuesto
    pago: HabitacionHospedajePago
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
