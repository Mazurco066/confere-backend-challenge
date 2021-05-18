// Dependencies
const { generateField, immutable, validation } = require('../utils')
const { pipe } = require('ramda')

// Card model
module.exports = {
  /**
   * Created card object with received params
   * @param {object} cardData 
   * @returns {object} containing created model
   */
  create: function (cardData) {
    if (!cardData) return { data: null, errors: ['invalid cardData'] }

    // Create object fields
    const createObject = (cardData) => [
      generateField('number', cardData.number, null, ''),
      generateField('expiry', cardData.expiry, null , ''),
      generateField('cvv', cardData.cvv, null , ''),
      generateField('holder', cardData.holder, null , null),
    ].reduce((ac, at) => ac = { ...ac, ...at }, {})

    // Validate fields
    const validateFields = (cardData, errors) => {
      const d = cardData || {}
      return pipe(
        validation.validateCardNumber(d.number, 'card "number" must be defined', true),
        validation.validateExpirity(d.expiry, 'card "expiry" must be defined', true),
        validation.validateCvv(d.cvv, 'card "cvv" must be defined', true),
        validation.validateDescription(d.holder, 'card "holder" must be defined and have between 2 and 250 chars', false)
			)(errors)
    }

    // Creating model
    const data = createObject(cardData)
    const errors = validateFields(data, [])

    // Returning model
    return { data: (errors.length > 0 ? null : immutable(data)), errors }
  },

  /**
   * Updates model data
   * @param {object} card - Previous object 
   * @param {object} changes - Field changes
   * @returns {object} containing updated model
   */
  update: function (card, changes) {
		return this.create({ ...card, ...changes })
	}
}