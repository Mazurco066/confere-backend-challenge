// Dependencies
const { config } = require('dotenv')

// Init env variables
config()

// MongoDb Connection
module.exports = async (connection) => {
  // Connection parameters
  const parameters = {
    protocol: (process.env.ENVIROMENT === 'prod' ? process.env.MONGODB_PROTOCOL : process.env.MONGODB_PROTOCOL_TEST),
    address: (process.env.ENVIROMENT === 'prod' ? process.env.MONGODB_ADDRESS : process.env.MONGODB_ADDRESS_TEST),
    port: (process.env.ENVIROMENT === 'prod' ? process.env.MONGODB_PORT : process.env.MONGODB_PORT_TEST),
    user: (process.env.ENVIROMENT === 'prod' ? process.env.MONGODB_USER : process.env.MONGODB_USER_TEST),
    password: (process.env.ENVIROMENT === 'prod' ? process.env.MONGODB_PASSWORD : process.env.MONGODB_PASSWORD_TEST),
    dbName: (process.env.ENVIROMENT === 'prod' ? process.env.MONGODB_DBNAME : process.env.MONGODB_DBNAME_TEST)
  }

  // Connecting to server
  const mongoConnection = await connection.create(parameters)
  return mongoConnection.connection
}