// Dependencies
const { baseResponse } = require('../../../utils')

/**
 * Receivement query
 * @param {connection} connection - Mongo db connection object
 * @returns {repository} Receivement query
 */
module.exports = (connection) => ({
  // Method to list receivements from mongo
	list: async function (receivementFilter) {
    // Base filter
    const filter = {
      status: new RegExp(receivementFilter.status || '')
    }
    // Conditional filter
    const { fromDate, toDate } = receivementFilter
    if (fromDate || toDate) {
      filter['receivementDate'] = (fromDate && toDate)
        ? { $gt: fromDate, $lt: toDate }
        : (fromDate && !toDate)
          ? { $eq: fromDate }
          : { $lt: toDate }
    }
    // Query
    const r = await connection.collection('Receivements').find({ ...filter })
    .limit(receivementFilter.limit || 0)
    .skip(receivementFilter.offset || 0)
    .sort({'receivementDate': -1})
    .toArray()
    if (r.length) return baseResponse(200, 'Receivement list found', {}, { list: r })
    return baseResponse(404, 'No receivements found')
  },

  // Method to list balance from mongo
  balance: async function (receivementFilter) {
    // Params
    const { today } = receivementFilter
    // Received
    const received = await connection.collection('Receivements').find({
      receivementDate: { $lte: today }
    }).toArray()
    // Expected
    const expected = await connection.collection('Receivements').find({
      receivementDate: { $gt: today }
    }).toArray()
    // Returning
    if (received.length || expected.length)
      return baseResponse(200, 'Balance list found', {}, {
        received: received,
        expected: expected
      })
    return baseResponse(404, 'No balance found')
  }
})