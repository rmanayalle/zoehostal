const type = `
  type Presupuesto{
    total: Float
    totalNeedsToBeCashed: Float
    detalle: [PresupuestoDetalle]
  }

  type PresupuestoDetalle{
    fechaInicio: Date
    fechaFinal: Date
    precio: Float
    needsToBeCashed: Boolean
  }
`;

module.exports = {
  type
};
