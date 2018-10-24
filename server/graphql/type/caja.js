const type = `
  type Caja{
    isClosed: Boolean
    fecha: Date
    inicial: Float
    historia: CajaHistoria
  }

  type CajaHistoria {
    total: Float
    hospedaje: [CajaHistoriaHospedaje]
    otro: [CajaHistoriaOtro]
  }

  type CajaHistoriaOtro {
    fecha: Date
    monto: Float
    asunto: String
  }

  type CajaHistoriaHospedaje{
    fecha: Date
    monto: Float
    habitacion: CajaHistoriaHospedajeHabitacion
    cliente: Cliente
  }

  type CajaHistoriaHospedajeHabitacion{
    nombre: String
    tipo: String
    tarifa: Float
  }

`;

module.exports = {
  type
};
