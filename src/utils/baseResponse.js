/**
 * Base response object
 * @param {number} statusCode - response status code
 * @param {string} statusmessage - response status message
 * @param {object} currentParameter - response data
 * @param {object} newObject - new fields for response object (merge)
 * @param {Array} messageList - validation messages
 * @returns {object} Base reponse object
 */
module.exports = (statusCode, statusmessage, currentParameter = {}, newObject = {}, messageList = []) => {
  const message = `${statusmessage}${(messageList.length > 0 ? ': ' + messageList.join(' | ') : '')}`
  return {
      ...currentParameter,
      ...{
          status: {
              code: statusCode,
              message: message
          },
          ...newObject
      }
  }
}