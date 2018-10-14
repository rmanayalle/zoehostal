const { ApolloServer, makeExecutableSchema } = require('apollo-server');
const mongoose = require('./config/mongoose');

const _index = require('./graphql/index');

const typeHabitacion = require('./graphql/type/habitacion');
const typeCliente = require('./graphql/type/cliente');
const typePresupuesto = require('./graphql/type/presupuesto');

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
