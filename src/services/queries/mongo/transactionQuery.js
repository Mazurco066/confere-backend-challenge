// Dependencies
const { baseResponse } = require('../../../utils')

/**
 * Transaction query
 * @param {connection} connection - Mongo db connection object
 * @returns {repository} Transaction query
 */
module.exports = (connection) => ({
  // Method to list transactions from mongo
	list: async function (transactionFilter) {
    const r = await connection.collection('Transactions').find({
      type: new RegExp(transactionFilter.type || ''),
      description: new RegExp(transactionFilter.description || '')
    })
    .limit(transactionFilter.limit || 0)
    .skip(transactionFilter.offset || 0)
    .sort({'value': 1})
    .toArray()
    if (r.length) return baseResponse(200, 'Transaction list found', {}, { list: r })
    return baseResponse(404, 'No transactions found')
  }
})