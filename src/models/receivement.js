// Dependencies
const { v4 } = require('uuid')
const { generateField, immutable, validation } = require('../utils')
const { pipe } = require('ramda')

// Receivement model
module.exports = {
  /**
   * Created receivement object with received params
   * @param {object} receivementData 
   * @returns {object} containing created model
   */
  create: function (receivementData) {
    if (!receivementData) return { data: null, errors: ['invalid receivementData'] }

    // Create object fields
    const createObject = (receivementData) => [
      generateField('id', receivementData.id, null, v4()),
      generateField('transactionId', receivementData.transactionId, null, ''),
      generateField('status', receivementData.status, null, ''),
      generateField('receivementDate', receivementData.receivementDate, null , ''),
      generateField('grossValue', receivementData.grossValue, null , 0),
      generateField('netValue', receivementData.netValue, null , 0)
    ].reduce((ac, at) => ac = { ...ac, ...at }, {})

    // Validate fields
    const validateFields = (receivementData, errors) => {
      const d = receivementData || {}
      return pipe(
				validation.validateUUID(d.id, 'receivement "id" is not a valid UUID', true),
        validation.validateUUID(d.transactionId, 'receivement "transactionId" is not a valid UUID', true),
        validation.validateStatus(d.status, 'receivement "status" must be either "received" or "expected"', true),
        validation.validate_YYYY_MM_DD(d.receivementDate, 'receivement "receivementDate" is not a valid YYYY_MM_DD date', true),
        validation.validateNumber(d.grossValue, 'receivement "grossValue" must be defined and greater than 0', true),
        validation.validateNumber(d.netValue, 'receivement "netValue" must be defined and greater than 0', true)
			)(errors)
    }

    // Creating model
    const data = createObject(receivementData)
    const errors = validateFields(data, [])

    // Returning model
    return { data: (errors.length > 0 ? null : immutable(data)), errors }
  },

  /**
   * Updates model data
   * @param {object} receivement - Previous object 
   * @param {object} changes - Field changes
   * @returns {object} containing updated model
   */
  update: function (receivement, changes) {
		return this.create({ ...receivement, ...changes })
	}
}