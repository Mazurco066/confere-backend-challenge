// Dependencies
const { baseResponse } = require('../utils')

/**
 * API Controller
 * @param {*} interfaces - instanced interfaces
 * @returns {object} containing api run methods
 */
module.exports = (interfaces) => ({
  run: async (methodName, req, res) => {
    // Avaliable requisitions
    const requisition = {

    }
    // Global error treatment
    try {
      const r = await requisition[methodName](req)
      return res.status(r.status.code).json(
        baseResponse(
          r.status.code,
          r.status.message,
          { data: r.data }
        )
      )
    } catch (err) {
      console.error('[ERROR]', '[api.controller.run]', `[${err.message}]`, err)
      return res.status(500).json(baseResponse(500, 'Ops.. error while using the REST Service.'))
    }
  }
})