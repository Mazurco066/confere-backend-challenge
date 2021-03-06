// Dependencies
const { readFileSync } = require('fs')
const { resolve } = require('path')
const { baseResponse } = require('../../../utils')

// Package
const pj = readFileSync(resolve(__dirname, '../../../../package.json'))
const { version } = JSON.parse(pj)

/**
 * Module for express routing.
 * @param {controller} controller - api controller.
 * @param {express} app - express app.
 * @returns {express} express app with configured routes.
 */
module.exports = controller => app => {

  // Version path
  app.get('/', (_, res) => res.status(200).json(baseResponse(200, `Confere backend version: ${version}`)))

  // Command paths
  app.post('/transaction', async (req, res) => await controller.run('proccessTransaction', req, res))

  // Query paths
  app.get('/transactions', async (req, res) => await controller.run('listTransactions', req, res))
  app.get('/receivables', async (req, res) => await controller.run('listReceivables', req, res))
  app.get('/balance', async (req, res) => await controller.run('listBalance', req, res))

  // Returning app with configures routes
  return app
}