// Dependencies
const moment = require('moment')
const { baseResponse, pipeline, is_YYYY_MM_DD } = require('../../utils')

// Query
module.exports = (receivementQuery) => ({
  // Running list balance query
	run: async function (parameter) {
		// List receivables pipeline
		const p = pipeline(
			this.validateParameter,
      this.listReceivements,
			this.calcBalance
		)
		const r = await p(parameter)
		
		// Returning success or error 
		return baseResponse(r.status.code, r.status.message, {}, {
			data: r.balance || {}
		})
	},

  // Validating parameters
	validateParameter: function (data) {
		// Common
		if (!data || typeof data.receivementFilter === 'undefined') {
			return baseResponse(400, 'invalid parameter: {receivementFilter: Object}', data )
		}

		// Optional interval
		const { fromDate, toDate } = data.receivementFilter
		if ((fromDate && !toDate) || (toDate && !fromDate)) {
			return baseResponse(400, 'invalid parameter: if you inform fromDate or toDate you must inform the other param to form a interval', data )
		}
		if (fromDate && !is_YYYY_MM_DD(fromDate)) {
			return baseResponse(400, 'invalid parameter: fromDate must be on YYYY-MM-DD format', data )
		}
		if (toDate && !is_YYYY_MM_DD(toDate)) {
			return baseResponse(400, 'invalid parameter: toDate must be on YYYY-MM-DD format', data )
		}

		// OK
		return baseResponse (200, 'valid parameter.', data)
	},

  // Find data
  listReceivements: async function (data) {
    const r = await receivementQuery.balance({
			...data.receivementFilter,
			today: moment().format('YYYY-MM-DD')
		})
		return baseResponse(r.status.code, r.status.message, data, { 
			received: r.received ? r.received : [],
			expected: r.expected ? r.expected : [],
		})
  },

	// Calculate balance
	calcBalance: async function (data) {
		const { received, expected } = data
		const receivedGrossBalance = received.reduce((ac, { grossValue }) => ac + grossValue, 0)
		const receivedNetBalance = received.reduce((ac, { netValue }) => ac + netValue, 0)
		const expectedGrossBalance = expected.reduce((ac, { grossValue }) => ac + grossValue, 0)
		const expectedNetBalance = expected.reduce((ac, { netValue }) => ac + netValue, 0)
		return baseResponse(200, 'Balance calculated', data, {
			balance: {
				received: {
					grossBalance: receivedGrossBalance,
					netBalance: receivedNetBalance
				},
				expected: {
					grossBalance: expectedGrossBalance,
					netBalance: expectedNetBalance
				}
			}
		})
	}
})