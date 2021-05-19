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
      // POST to store or update developer
      proccessTransaction: async (req) => {
        const { value, description, type, installments, card } = req.body
        const r = await interfaces.commandsEntry.run('proccessTransaction', {
          transactionData: {
            value,
            description,
            type,
            installments,
            card
          }
        })
        return r
      },
      // GET to retrieve transactions list
      listTransactions: async(req) => {
        const { type, description, limit, offset } = req.query
        const r = await interfaces.queriesEntry.run('listTransactions', {
          transactionFilter: {
            type,
            description,
            limit: limit ? parseInt(limit) : 0,
            offset: offset ? parseInt(offset) : 0
          }
        })
        return r
      },
      // GET to retrieve receivables list
      listReceivables: async(req) => {
        const { fromDate, toDate, status, limit, offset } = req.query
        const r = await interfaces.queriesEntry.run('listReceivables', {
          receivementFilter: {
            status,
            fromDate: fromDate ? fromDate : '',
            toDate: toDate ? toDate : '',
            limit: limit ? parseInt(limit) : 0,
            offset: offset ? parseInt(offset) : 0
          }
        })
        return r
      },
      // GET to retrieve balance list
      listBalance: async(req) => {
        const r = await interfaces.queriesEntry.run('listBalance', {
          receivementFilter: {
            
          }
        })
        return r
      }
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