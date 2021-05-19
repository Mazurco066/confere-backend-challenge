// Dependencies
const { commandsEntry, queriesEntry } = require('../../../interfaces')
const { proccessTransaction } = require('../../../interfaces/commands')
const { listReceivables, listTransactions } = require('../../../interfaces/queries')

/**
 * Create user interaction interfaces
 * @param {*} repositories - Instanced repositories
 * @returns {object} containing instanced commands and queries
 */
module.exports = (repositories) => {
  // Repositories, Queries and Services
  const { receivementRepository, transactionRepository } = repositories.repositories
  const { receivementQuery, transactionQuery } = repositories.queries

  // Commands list
  const _commands = {
    proccessTransaction: proccessTransaction(transactionRepository, receivementRepository)
  }

  // Queries list
  const _queries = {
    listReceivables: listReceivables(receivementQuery),
    listTransactions: listTransactions(transactionQuery)
  }

  // Injecting commands and queries
  const _commandsEntry = commandsEntry(_commands)
	const _queriesEntry = queriesEntry(_queries)

  // Entries with injected commands/queries
	return {
		commandsEntry: _commandsEntry,
		queriesEntry: _queriesEntry
	}
}