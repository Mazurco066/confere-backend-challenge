// Dependencies
const { receivementQuery, transactionQuery } = require('../../../services/queries/mongo')
const { receivementRepository, transactionRepository } = require('../../../services/repositories/mongo')

/**
 * Setup repositores with dependencies
 * @param {*} connection - mongodb connection
 * @returns {object} instanced repositories
 */
module.exports = (connection) => {

  // Repositories
  const _receivementQuery = receivementQuery(connection)
  const _transactionQuery = transactionQuery(connection)
  const _receivementRepository = receivementRepository(connection)
  const _transactionRepository = transactionRepository(connection)

  // Returning repositores, queries and services
  return {
    repositories: {
      receivementRepository: _receivementRepository,
      transactionRepository: _transactionRepository
    },
    queries: {
      receivementQuery: _receivementQuery,
      transactionQuery: _transactionQuery
    },
    services: { }
  }
}