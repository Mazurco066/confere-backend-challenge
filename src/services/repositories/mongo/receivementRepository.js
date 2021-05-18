// Dependencies
const { receivement } = require('../../../models')
const { baseResponse } = require('../../../utils')
const { compose } = require('ramda')

/**
 * Receivement repository
 * @param {connection} connection - Mongo db connection object
 * @returns {repository} Receivement repository
 */
module.exports = (connection) => ({
  // Method to get receivement from mongo
	get: async function (receivementData) {
		if (!receivementData || typeof receivementData.id == 'undefined')
			return baseResponse(400, 'Invalid receivement data: {id: string}')

		const r = await connection.collection('Receivements').findOne({ id: receivementData.id })
		if (r) return baseResponse(200, 'Receivement found', {}, {
      receivementReturn: receivement.create(r)
    })
		return baseResponse(404, 'Receivement not found')
	},

  // Method to store receivement into mongo
	store: async function (receivementData) {
		// Validating receivement object
		const validateReceivement = receivementData => receivement.create(receivementData)

		// Aux to insert receivement into mongo
		const insertReceivement = async (receivementData) => {
			try {
				await connection.collection('Receivements').insertOne({ ...receivementData })
				return baseResponse(201, 'Receivement successfully stored.')
			} catch (err) {
				console.error('[ERROR]','[services.repositories.mongo.receivementRepository.store.insertReceivement]', `[${err.message}]`, err)
				return baseResponse(500, 'Internal error while inserting a receivement')
			}
		}

		// Aux to update receivement on mongo
		const updateReceivement = async (receivementData) => {
			const r = await connection.collection('Receivements').updateOne(
				{ id: receivementData.id },
				{ $set: {
					status: receivementData.status,
          receivementDate: receivementData.receivementDate
				}}
			)
			const code = (r.result.ok != 1 || r.result.nModified < 1 ? 404 : 200)
			const message = (code === 200 ? 'Receivement successfully updated' : 'No receivement information has changed')
			return baseResponse(code, message)
		}

		// Aux to store receivement into mongo
		const storeReceivement = async (receivementReturn) => {
			if (receivementReturn.data) {
				const r = await this.get(receivementReturn.data)
				if (r.status.code != 200 && r.status.code != 404) return r
				return r.status.code === 200
					? await updateReceivement({ ...receivementReturn.data })
					: await insertReceivement({ ...receivementReturn.data })
			} else {
				return baseResponse(400, 'Invalid data for receivement', {}, {}, receivementReturn.errors)
			}
		}

		// Returning the store procedure
		return await compose(storeReceivement, validateReceivement)(receivementData)
	}
})