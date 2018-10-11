const _dateScalar = require('./scalars/date');

const logicHabitacion = require('../logic/habitacion');
const logicCliente = require('../logic/cliente');
const logicOperaciones = require('../logic/operaciones');
const logicReniec = require('../logic/reniec');

const rootQuery = `
  type rootQuery {
    habitacion(habitacion: HabitacionPartialInput!): [Habitacion]
    cliente(cliente: ClienteInput!): Cliente
    presupuestar(habitacion: HabitacionPartialInput!, fechaInicio: Date!, fechaFinal: Date!): Presupuesto
    reniec(documentoNacional: String!): Cliente
  }
`;

const rootMutation = `
  type rootMutation {
    alquilar(habitacion: HabitacionPartialInput!, cliente: ClienteInput!, fechaFinal: Date!): Habitacion
    pagar(habitacion: HabitacionPartialInput!, monto: Float!): Habitacion
  }
`;

const resolvers = {
  rootQuery: {
    habitacion(obj, args, context, info){
      return logicHabitacion.getHabitacion(args);
    },
    cliente(obj, args, context, info){
      return logicCliente.getCliente(args);
    },
    presupuestar(obj, args, context, info){
      return logicOperaciones.presupuestar(args.habitacion, new Date(2018,12,12,14,0,0), new Date(2018,12,12,12,0,0), args.fechaInicio, args.fechaFinal);
    },
    reniec(obj, args, context, info){
      return logicReniec.getClienteFromReniec(args.documentoNacional);
    }
  },
  rootMutation: {
    alquilar(obj, args, context, info){
      return logicOperaciones.alquilar(args.habitacion, args.cliente, new Date(2018,12,12,14,0,0), new Date(2018,12,12,12,0,0), args.fechaFinal);
    },
    pagar(obj, args, context, info){
      return logicOperaciones.pagar(args.habitacion, args.monto);
    }
  },
  Date: _dateScalar.type
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
