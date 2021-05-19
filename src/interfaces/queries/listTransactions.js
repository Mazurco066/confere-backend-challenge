// Dependencies
const { baseResponse, pipeline } = require('../../utils')

// Query
module.exports = (transactionQuery) => ({
  // Running list transaction query
	run: async function (parameter) {
		// List transactions pipeline
		const p = pipeline(
			this.validateParameter,
      this.listTransactions
		)
		const r = await p(parameter)
		
		// Returning success or error 
		return baseResponse(r.status.code, r.status.message, {}, {
			data: r.transactionList || []
		})
	},

  // Validating parameters
	validateParameter: function (data) {
		if (!data || 	typeof data.transactionFilter === 'undefined') {
			return baseResponse(400, 'invalid parameter: {transactionFilter: Object}', data )
		}
		return baseResponse (200, 'valid parameter.', data)
	},

  // Find data
  listTransactions: async function (data) {
    const r = await transactionQuery.list(data.transactionFilter)
		return baseResponse(r.status.code, r.status.message, data, { 
			transactionList: r.list ? r.list : []
		})
  }
})