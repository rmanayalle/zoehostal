const scalarDate = require('./scalar/date');
const logicCliente = require('../logic/cliente');
const logicHabitacion = require('../logic/habitacion');
const logicOperaciones = require('../logic/operaciones');
const logicReniec = require('../logic/reniec');
const utilGlobal = require('../util/global');

const rootQuery = `
  type rootQuery {
    habitacion(habitacion: HabitacionInput!): [Habitacion]
    presupuesto(tarifa: Float!, fechaFinal: Date!, fechaInicio: Date): Presupuesto
    cliente(documentoNacional: String!): Cliente
    date: Date
  }
`;

const rootMutation = `
  type rootMutation {
    rent(habitacionNombre: String, documentoNacional: String, fechaFinal: Date!): Habitacion
    pay(habitacionNombre: String, monto: Float!): Habitacion
    cliente(cliente: ClienteInput!): Cliente
    fechaFinal(habitacionNombre: String!, fechaFinal: Date!): Habitacion
  }
`;

const resolvers = {
  rootQuery: {
    habitacion(obj, args, context, info){
      return logicHabitacion.getHabitacion(args);
    },
    presupuesto(obj, args, context, info){
      let date =  new Date();
      if(args.fechaInicio !== undefined)date = args.fechaInicio;
      return logicOperaciones.presupuestar(args.tarifa, utilGlobal.checkIn, utilGlobal.checkOut,date, args.fechaFinal);
    },
    cliente(obj, args, context, info){
      return logicReniec.getClienteFromReniec(args.documentoNacional);
    },
    date: () => new Date
  },
  rootMutation: {
    rent(obj, args, context, info){
      return logicOperaciones.rent(args.habitacionNombre, args.documentoNacional, utilGlobal.checkIn, utilGlobal.checkOut, args.fechaFinal);
    },
    pay(obj, args, context, info){
      return logicOperaciones.pay(args.habitacionNombre, args.monto);
    },
    cliente(obj, args, context, info){
      return logicCliente.addCliente(args.cliente);
    },
    fechaFinal(obj, args, context, info){
      return logicHabitacion.setFechaFinal(args.habitacionNombre, args.fechaFinal);
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
