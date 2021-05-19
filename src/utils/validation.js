// Dependencies
const { curry, isEmpty } = require('ramda')

// Validate person name
const validateDescription = (desc, message, mandatory, errors) => {
  if (!mandatory && !desc) return errors
  return /^([a-zA-Zà-úÀ-Ú0-9 ]{2,250})$/.test(desc)
    ? errors
    : errors.concat([message])
}

// Validates receivement status
const validateStatus = (status, message, mandatory, errors) => {
	if (!mandatory && !status) return errors
	return ['received', 'expected'].includes(status)
		? errors
		: errors.concat([message])
}

// Validates transaction type
const validateType = (type, message, mandatory, errors) => {
	if (!mandatory && !type) return errors
	return ['installment_credit', 'credit', 'debit'].includes(type)
		? errors
		: errors.concat([message])
}

// Validates card number
const validateCardNumber = (number, message, mandatory, errors) => {
	if (!mandatory && !number) return errors
	return number.length === 4 || /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11}|62[0-9]{14})$/.test(number)
		? errors
		: errors.concat([message])
}

// Validates ccv
const validateCvv = (cvv, message, mandatory, errors) => {
	if (!mandatory && !cvv) return errors
	return typeof cvv === 'string' && cvv.length === 3
		? errors
		: errors.concat([message])
}

// Validates expirity
const validateExpiry = (value, message, mandatory, errors) => {
	if (!mandatory && !value) return errors
	return /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/.test(value)
		? errors
		: errors.concat([message])
}

// Validates installments
const validateNumber = (value, message, mandatory, errors) => {
	if (!mandatory && !value) return errors
	return typeof value === 'number' && value > 0 
		? errors
		: errors.concat([message])
}

// Validate if nested object was successfully created
const validateNestedObject = (nested, _, mandatory, errors) => {
	if (!mandatory) return errors
	return nested.length === undefined
		? errors
		: errors.concat(nested)
}

// Validates date format YYYY_MM_DD
const validate_YYYY_MM_DD = (date, message, mandatory, errors) => {
	if (!mandatory && !date) return errors
	return /^\d{4}[\-\/\s]?((((0[13578])|(1[02]))[\-\/\s]?(([0-2][0-9])|(3[01])))|(((0[469])|(11))[\-\/\s]?(([0-2][0-9])|(30)))|(02[\-\/\s]?[0-2][0-9]))$/.test(date)
		? errors
		: errors.concat([message])
}

// Validates UUID v4
const validateUUID = (uuid, message, mandatory, errors) => {
  if (!mandatory && !uuid) return errors
	return /^[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$/.test(uuid) ?
		errors :
		errors.concat([message])
}

// Validates a mandatory field
const validateMandatoryField = (value, message, errors) => {
  if (value) return errors.concat([message])
	return isEmpty(value) ?
		errors.concat([message]) :
		errors
}

// Validates array
const validateArray = (array, message, errors) => {
	return Array.isArray(array) ? errors : errors.concat([message]);
}

// Exporting
module.exports = {
	validateNestedObject: curry(validateNestedObject),
	validateCardNumber: curry(validateCardNumber),
	validateCvv: curry(validateCvv),
	validateExpiry: curry(validateExpiry),
	validateDescription: curry(validateDescription),
	validateStatus: curry(validateStatus),
	validateType: curry(validateType),
	validate_YYYY_MM_DD: curry(validate_YYYY_MM_DD),
	validateNumber: curry(validateNumber),
	validateUUID: curry(validateUUID),
  validateMandatoryField: curry(validateMandatoryField),
  validateArray: curry(validateArray)
}
