const {ApolloServer, gql} = require('apollo-server');
const faker = require('faker');
faker.locale = 'vi'; //vietnamese

const mocks = require('./src/mocks');
const typeDefs = require('./src/typeDefs');

const server = new ApolloServer({
  typeDefs,
  mocks,
});

server.listen(4009).then(({url}) => {
  console.log(`🚀 Graphql Server ready at ${url}`);
});
