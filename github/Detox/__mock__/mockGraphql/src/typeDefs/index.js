const {gql} = require('apollo-server');
const schemaText = require('./readSchemaText');

const typeDefs = gql`
  ${schemaText}
`;
module.exports = typeDefs;
