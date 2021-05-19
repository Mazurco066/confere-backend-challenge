// Dependencies
const { baseResponse, pipeline, is_YYYY_MM_DD } = require('../../utils')

// Query
module.exports = (receivementQuery) => ({
  // Running list receivement query
	run: async function (parameter) {
		// List receivables pipeline
		const p = pipeline(
			this.validateParameter,
      this.listReceivements
		)
		const r = await p(parameter)
		
		// Returning success or error 
		return baseResponse(r.status.code, r.status.message, {}, {
			data: r.receivementList || []
		})
	},

  // Validating parameters
	validateParameter: function (data) {
		// Common parameters
		if (!data || 	typeof data.receivementFilter === 'undefined') {
			return baseResponse(400, 'invalid parameter: {receivementFilter: Object}', data )
		}
		
		// Optional filters
		const { fromDate, toDate } = data.receivementFilter
		if (fromDate && !is_YYYY_MM_DD(fromDate)) {
			return baseResponse(400, 'invalid parameter: fromDate must be on YYYY-MM-DD format', data )
		}
		if (toDate && !is_YYYY_MM_DD(toDate)) {
			return baseResponse(400, 'invalid parameter: toDate must be on YYYY-MM-DD format', data )
		}

		// Ok	
		return baseResponse (200, 'valid parameter.', data)
	},

  // Find data
  listReceivements: async function (data) {
    const r = await receivementQuery.list(data.receivementFilter)
		return baseResponse(r.status.code, r.status.message, data, { 
			receivementList: r.list ? r.list : []
		})
  }
})