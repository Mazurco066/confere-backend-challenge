// Dependencies
const moment = require('moment')
const { baseResponse, pipeline } = require('../../utils')
const { transaction, receivement } = require('../../models')

// Command
module.exports = ( transactionRepository, receivementRepository) => ({
  // Running proccess transaction command
	run: async function (parameter) {
		// Insert transaction pipeline
		const p = pipeline(
			this.validateParameter,
      this.generateTransaction,
      this.applyFee,
      this.generateReceivements,
      this.storeReceivements,
      this.storeTransaction
		)
		const r = await p(parameter)
		
		// Returning success or error 
		return baseResponse(r.status.code, r.status.message, {}, {
			data: r.feeTransaction
        ? {
          ...r.feeTransaction,
          card: {
            ...r.feeTransaction.card,
            number: r.feeTransaction.card.number.substr(r.feeTransaction.card.number.length - 4)
          }
        }
        : null
		})
	},

  // Validating parameters
	validateParameter: function (data) {
    // Common rules
		if (
			!data || 
			typeof data.transactionData === 'undefined' ||
			typeof data.transactionData.value === 'undefined' ||
      typeof data.transactionData.description === 'undefined' ||
      typeof data.transactionData.type === 'undefined' ||
      typeof data.transactionData.card === 'undefined'
		) {
			return baseResponse(400, 'invalid parameter: {transactionData: Object}', data )
		}

    // Custom rules
    const { type, installments } = data.transactionData
    if (type === 'debit' && installments !== undefined) {
      return baseResponse(400, 'invalid parameter: installments must null on debit type', data )
    }
    if (type === 'credit' && (installments === undefined || installments === null)) {
      return baseResponse(400, 'invalid parameter: installments must be 1 or greater on credit type', data )
    }

    // Ok
		return baseResponse (200, 'valid parameter.', data)
	},

  // Generating a transaction object
	generateTransaction: function (data) {
		const transactionData = transaction.create(data.transactionData)
		if (transactionData.data)
			return baseResponse(200, 'Created transaction.', data, { transaction: transactionData.data })
		return baseResponse(400, 'Inconsistent data', data, {}, transactionData.errors)
	},

  // Apply fee
  applyFee: function (data) {
    const { transaction: { type, installments, value, ...rest } } = data

    const fee = type === 'debit'
      ? value * 0.028
      : installments === 1
        ? value * 0.032
        : (installments >= 2 && installments <= 6)
          ? value * 0.038
          : value * 0.042

    const t = transaction.update({ 
      type,
      installments,
      value,
      ...rest
    }, { value: value - fee })

    return baseResponse(200, 'Transaction updated', data, {
      feeTransaction: t.data
    })
  },

  // Calc receivements
  generateReceivements: function (data) {
    const {
      transaction: { id, type, installments, value },
      feeTransaction: { value: feeValue }
    } = data
    
    // Generates just one receivement
    const generateSingleReceivement = status => {
      const today = moment()
      const r = receivement.create({
        status: status,
        receivementDate: today.add(30, 'days').format('YYYY-MM-DD'),
        transactionId: id,
        grossValue: value,
        netValue: feeValue
      })
      return baseResponse(200, 'Receivement(s) generated', data, { 
        receivements: [r.data]
      })
    }

    // Verifying transaction type
    if (type === 'debit') {
      return generateSingleReceivement('received')
    } else {
      if (installments === 1) {
        return generateSingleReceivement('expected')
      } else {
        const r = []
        
        for(let i = 0; i < installments; i++) {
          r.push(receivement.create({
            status: 'expected',
            receivementDate: moment().add((30 * (i + 1)), 'days').format('YYYY-MM-DD'),
            transactionId: id,
            grossValue: (value / installments),
            netValue: (feeValue / installments)
          }).data)
        }

        return baseResponse(200, 'Receivement(s) generated', data, { 
          receivements: r
        })
      }
    }
  },

  // Store receivements
  storeReceivements: async function (data) {
    const promises = data.receivements.map(async r => await receivementRepository.store(r))
    await Promise.all(promises)
    return baseResponse(200, 'Receivement(s) successfully stored', data)
  },

  // Store transaction
  storeTransaction: async function (data) {
    const r = await transactionRepository.store(data.feeTransaction)
		return baseResponse(r.status.code, r.status.message, data)
  }
})