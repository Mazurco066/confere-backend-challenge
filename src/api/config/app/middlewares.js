// Middlewares
const { json, urlencoded } = require('express')
const cors = require('cors')

/**
 * Module to inject middlewares into an express app.
 * @param {express} app - express app.
 * @returns {express} app with injected middlewares.
 */
module.exports = (app) => {
  app.use(cors())
  app.use(json())
  app.use(urlencoded({ extended: true }))
  return app
}