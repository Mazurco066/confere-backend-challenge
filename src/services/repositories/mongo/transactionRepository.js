// Dependencies
const { transaction } = require('../../../models')
const { baseResponse } = require('../../../utils')
const { compose } = require('ramda')

/**
 * Transaction repository
 * @param {connection} connection - Mongo db connection object
 * @returns {repository} Transaction repository
 */
module.exports = (connection) => ({
  // Method to get transaction from mongo
	get: async function (transactionData) {
		if (!transactionData || typeof transactionData.id == 'undefined')
			return baseResponse(400, 'Invalid transaction data: {id: string}')

		const r = await connection.collection('Transactions').findOne({ id: transactionData.id })
		if (r)
			return baseResponse(200, 'Transaction found', {}, {
        transactionReturn: transaction.create(r)
      })
		return baseResponse(404, 'Transaction not found')
	},

  // Method to store transaction into mongo
	store: async function (transactionData) {
		// Validating transaction object
		const validateTransaction = transactionData => transaction.create(transactionData)

		// Aux to insert developer into mongo
		const insertTransaction = async (transactionData) => {
			try {
				await connection.collection('Transactions').insertOne({
          ...transactionData,
          card: {
            ...transactionData.card,
            number: transactionData.card.number.substr(transactionData.card.number.length - 4)
          }
        })
				return baseResponse(201, 'Transaction successfully stored.')
			} catch (err) {
				console.error('[ERROR]','[services.repositories.mongo.transactionRepository.store.insertTransaction]', `[${err.message}]`, err)
				return baseResponse(500, 'Internal error while inserting a transaction')
			}
		}

		// Aux to update developer on mongo
		const updateTransaction = async (transactionData) => {
			const r = await connection.collection('Transactions').updateOne(
				{ id: transactionData.id },
				{ $set: {
					value: transactionData.value,
          description: transactionData.description,
          type: transactionData.type,
          installments: transactionData.installments,
          card: {
            ...transactionData.card,
            number: transactionData.card.number.substr(transactionData.card.number.length - 4)
          }
				}}
			)
			const code = (r.result.ok != 1 || r.result.nModified < 1 ? 404 : 200)
			const message = (code === 200 ? 'Transaction successfully updated' : 'No transaction information has changed')
			return baseResponse(code, message)
		}

		// Aux to store transaction into mongo
		const storeTransaction = async (transactionReturn) => {
			if (transactionReturn.data) {
				const r = await this.get(transactionReturn.data)
				if (r.status.code != 200 && r.status.code != 404) return r
				return r.status.code === 200
					? await updateTransaction({ ...transactionReturn.data })
					: await insertTransaction({ ...transactionReturn.data })
			} else {
				return baseResponse(400, 'Invalid data for transaction', {}, {}, transactionReturn.errors)
			}
		}

		// Returning the store procedure
		return await compose(storeTransaction, validateTransaction)(transactionData)
	}
})