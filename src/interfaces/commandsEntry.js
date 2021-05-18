// Dependencies
const { baseResponse } = require('../utils')

/**
 * Commands entrypoint
 * @param {Array} commands 
 * @returns {object} - Command list
 */
module.exports = (commands) => ({
  getCommand: function (commandId) {
    return commands[commandId]
  },
  run: async function (commandId, parameters = {}) {
    const command = this.getCommand(commandId)
    if (!command) return baseResponse(400, `invalid command: ${commandId}`)
    return await command.run(parameters)
  }
})