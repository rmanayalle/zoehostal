const type = `
  type Presupuesto{
    total: Float
    detalle: [PresupuestoDetalle]
  }

  type PresupuestoDetalle{
    fechaInicio: Date
    fechaFinal: Date
    precio: Float
  }
`;

module.exports = {
  type
};
