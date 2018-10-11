const { ApolloServer, makeExecutableSchema } = require('apollo-server');
const mongoose = require('./config/mongoose');

const _index = require('./graphql/index');

const typeHabitacion = require('./graphql/types/habitacion');
const typeCliente = require('./graphql/types/cliente');
const typePresupuesto = require('./graphql/types/presupuesto');

const reniec = require('./logic/reniec.js');


const db = mongoose();

const server = new ApolloServer({
  typeDefs: [

    _index.rootQuery,
    _index.rootMutation,

    _index.schema,

    typeHabitacion.type,
    typeCliente.type,
    typePresupuesto.type,

  ],
  resolvers: _index.resolvers
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
