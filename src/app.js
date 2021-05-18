// Dependencies
const express = require('express')
const http = require('http')
const { compose, andThen } = require('ramda')
const { connection } = require('./helpers')
const { controller } = require('./api')
const { middlewares, router } = require('./api/config/app')
const { mongoConnection, interfaces, repositories } = require('./api/config/services')

// App Init
module.exports = async () => {
  // Generate app services
  const createServices = async (connection) => {
		const _c = compose(andThen(controller),	andThen(interfaces), andThen(repositories), mongoConnection)
		const _controller = await _c(connection)
		return _controller
	}

  // Configure middlewares
  const configApp = (controller) => {
		const createApp = () => express()
		const configureMiddlewares = (app) => middlewares(app)
		const configureRouter = router(controller)
		const _c = compose(configureRouter,	configureMiddlewares,	createApp)
		const _app = _c()
		return http.Server(_app)
	}

  // Generate Express app
  const generateApp = compose(andThen(configApp), createServices)
	const _app = await generateApp(connection)

  // Returning app instance
  return _app
}