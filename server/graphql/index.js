const scalarDate = require('./scalar/date');
const logicHabitacion = require('../logic/habitacion');
const logicOperaciones = require('../logic/operaciones');
const logicReniec = require('../logic/reniec');
const utilGlobal = require('../util/global');

const rootQuery = `
  type rootQuery {
    habitacion(habitacion: HabitacionInput!): [Habitacion]
    presupuesto(tarifa: Float!, fechaInicio: Date!, fechaFinal: Date!): Presupuesto
    reniec(documentoNacional: String!): Cliente
  }
`;

const rootMutation = `
  type rootMutation {
    rent(habitacionNombre: String, documentoNacional: String, fechaFinal: Date!): Habitacion
    pay(habitacionNombre: String, monto: Float!): HabitacionHospedajePago
  }
`;

const resolvers = {
  rootQuery: {
    habitacion(obj, args, context, info){
      return logicHabitacion.getHabitacion(args);
    },
    presupuesto(obj, args, context, info){
      return logicOperaciones.presupuestar(args.tarifa, utilGlobal.checkIn, utilGlobal.checkOut, args.fechaInicio, args.fechaFinal);
    },
    reniec(obj, args, context, info){
      return logicReniec.getClienteFromReniec(args.documentoNacional);
    }
  },
  rootMutation: {
    rent(obj, args, context, info){
      return logicOperaciones.rent(args.habitacionNombre, args.documentoNacional, utilGlobal.checkIn, utilGlobal.checkOut, args.fechaFinal);
    },
    pay(obj, args, context, info){
      return logicOperaciones.pay(args.habitacionNombre, args.monto);
    }
  },
  Date: scalarDate.type
};

const schema = `
  scalar Date

  schema {
    query: rootQuery
    mutation: rootMutation
  }
`;

module.exports = {
  rootQuery,
  rootMutation,
  schema,
  resolvers
};
