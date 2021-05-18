// Dependencies
const { v4 } = require('uuid')
const { generateField, immutable, validation } = require('../utils')
const { pipe } = require('ramda')

// Transaction model
module.exports = {
  /**
   * Created transaction object with received params
   * @param {object} transactionData 
   * @returns {object} containing created model
   */
  create: function (transactionData) {
    if (!transactionData) return { data: null, errors: ['invalid transactionData'] }

    // Create object fields
    const createObject = (transactionData) => [
      generateField('id', transactionData.id, null, v4()),
      generateField('value', transactionData.value, null, ''),
      generateField('description', transactionData.description, null , ''),
      generateField('type', transactionData.type, null , ''),
      generateField('installments', transactionData.installments, null , null)
    ].reduce((ac, at) => ac = { ...ac, ...at }, {})

    // Validate fields
    const validateFields = (transactionData, errors) => {
      const d = transactionData || {}
      return pipe(
				validation.validateUUID(d.id, 'transaction "id" is not a valid UUID', true),
        validation.validateStatus(d.value, 'transaction "value" must be defined and greater than 0', true),
        validation.validateDescription(d.description, 'transaction "description" must be defined and have between 2 and 250 chars', true),
        validation.validateType(d.type, 'transaction "type" must be either "debit", "installment_credit" or "credit"', true),
        validation.validateNumber(d.installments, 'transaction "installments" must be greater then 0 if exists', false)
			)(errors)
    }

    // Creating model
    const data = createObject(transactionData)
    const errors = validateFields(data, [])

    // Returning model
    return { data: (errors.length > 0 ? null : immutable(data)), errors }
  },

  /**
   * Updates model data
   * @param {object} transaction - Previous object 
   * @param {object} changes - Field changes
   * @returns {object} containing updated model
   */
  update: function (transaction, changes) {
		return this.create({ ...transaction, ...changes })
	}
}