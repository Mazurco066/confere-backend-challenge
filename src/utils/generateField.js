//Dependencies
const { isEmpty } = require('ramda')

/**
 * Generates a field into a model
 * @param {*} fieldId - field name
 * @param {*} fieldValue - field value
 * @param {*} formatMethod - format value method
 * @param {*} defaultValue - default value
 * @returns the created field
 */
module.exports = (fieldId, fieldValue, formatMethod, defaultValue) => (
  {[fieldId]: (typeof fieldValue === 'undefined' || fieldValue === null || isEmpty(fieldValue)
    ? defaultValue
    : (formatMethod
        ? formatMethod(fieldValue)
        : fieldValue
      )
    )
  }
)

